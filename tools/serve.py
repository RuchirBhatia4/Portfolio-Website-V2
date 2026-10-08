"""Local preview server like `python3 -m http.server`, plus what Safari needs.

- Range requests (206 Partial Content): Safari will not play <video> from a
  server that ignores them, which made every clip sit on its poster locally.
- No caching, so a plain reload always shows the latest edit.

    python3 tools/serve.py 5180
"""
import http.server
import os
import re
import sys


class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        self.send_header("Accept-Ranges", "bytes")
        super().end_headers()

    def send_head(self):
        rng = self.headers.get("Range")
        path = self.translate_path(self.path)
        m = re.fullmatch(r"bytes=(\d*)-(\d*)", rng or "")
        if not m or not os.path.isfile(path):
            return super().send_head()
        size = os.path.getsize(path)
        start = int(m.group(1)) if m.group(1) else max(0, size - int(m.group(2) or 0))
        end = int(m.group(2)) if m.group(1) and m.group(2) else size - 1
        end = min(end, size - 1)
        if start > end:
            self.send_error(416, "Requested Range Not Satisfiable")
            return None
        f = open(path, "rb")
        f.seek(start)
        self.send_response(206)
        self.send_header("Content-Type", self.guess_type(path))
        self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
        self.send_header("Content-Length", str(end - start + 1))
        self.end_headers()
        self._remaining = end - start + 1
        return f

    def copyfile(self, src, dst):
        left = getattr(self, "_remaining", None)
        if left is None:
            return super().copyfile(src, dst)
        while left > 0:
            chunk = src.read(min(64 * 1024, left))
            if not chunk:
                break
            dst.write(chunk)
            left -= len(chunk)

    def log_message(self, *a):
        pass


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5180
    http.server.ThreadingHTTPServer(("", port), Handler).serve_forever()
