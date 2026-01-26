import React from "react";
import Tilt from "react-tilt";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { services } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

const ServiceCard = ({ index, title, icon }) => (
  <Tilt className='xs:w-[250px] w-full'>
    <motion.div
      variants={fadeIn("right", "spring", index * 0.5, 0.75)}
      className='w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card'
    >
      <div
        options={{
          max: 45,
          scale: 1,
          speed: 450,
        }}
        className='bg-tertiary rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col'
      >
        <img
          src={icon}
          alt='web-development'
          className='w-16 h-16 object-contain'
        />

        <h3 className='text-white text-[20px] font-bold text-center'>
          {title}
        </h3>
      </div>
    </motion.div>
  </Tilt>
);

const About = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Introduction</p>
        <h2 className={styles.sectionHeadText}>Overview.</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className='mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]'
      >
        I am a Master’s student in Computer Science with a strong focus on Machine
        Learning and Deep Learning, with hands-on experience building LLM-powered,
        production-ready systems. My work spans LLM integration,
        Retrieval-Augmented Generation (RAG), multimodal recommendation systems, and
        scalable ML pipelines, using tools such as PyTorch, TensorFlow, LangChain,
        and vector databases. I have built and deployed an LLM-based healthcare
        chatbot with optimized retrieval and caching, achieving significant
        improvements in response latency and domain-specific accuracy, and developed
        a multimodal recommendation system using LVLMs that delivered substantial
        gains in Recall@10 and NDCG@10. I am particularly interested in applying ML
        to solve real-world, high-impact problems at scale. I am a fast learner,
        motivated to deepen my expertise in applied ML, LLM systems, and MLOps, and
        I actively seek internship and research opportunities where I can collaborate
        with experienced engineers and researchers to build robust, scalable, and
        intelligent systems.
      </motion.p>

      <div className='mt-20 flex flex-wrap gap-10'>
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(About, "about");
