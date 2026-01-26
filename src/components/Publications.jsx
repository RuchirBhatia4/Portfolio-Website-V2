import React from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import { motion } from "framer-motion";

import "react-vertical-timeline-component/style.min.css";

import { styles } from "../styles";
import { publications } from "../constants";
import { SectionWrapper } from "../hoc";
import { textVariant } from "../utils/motion";

const PublicationCard = ({ publication }) => {
  return (
    <VerticalTimelineElement
      contentStyle={{
        background: "#1d1836",
        color: "#fff",
      }}
      contentArrowStyle={{ borderRight: "7px solid  #232631" }}
      date={publication.date}
      iconStyle={{ background: publication.iconBg }}
      icon={
        <div className='flex justify-center items-center w-full h-full'>
          <img
            src={publication.icon}
            alt={publication.company_name}
            className='w-[60%] h-[60%] object-contain'
          />
        </div>
      }
    >
      <div>
        <h3 className='text-white text-[24px] font-bold'>{publication.title}</h3>
        <p
          className='text-secondary text-[16px] font-semibold'
          style={{ margin: 0 }}
        >
          {publication.company_name}
        </p>
      </div>

      {publication.link && (
        <div className='mt-3 flex items-center gap-3'>
          <a
            href={publication.link}
            target='_blank'
            rel='noreferrer'
            className='border border-secondary rounded-full w-9 h-9 flex items-center justify-center hover:bg-secondary hover:bg-opacity-10 transition-all'
            aria-label='Open publication link'
          >
            <svg
              className='w-5 h-5 text-secondary'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25'
              />
            </svg>
          </a>
        </div>
      )}

      <ul className='mt-5 list-disc ml-5 space-y-2'>
        {publication.points.map((point, index) => (
          <li
            key={`publication-point-${index}`}
            className='text-white-100 text-[14px] pl-1 tracking-wider'
          >
            {point}
          </li>
        ))}
      </ul>
    </VerticalTimelineElement>
  );
};

const Publications = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} text-center`}>
          Research and IP
        </p>
        <h2 className={`${styles.sectionHeadText} text-center`}>
          Publications.
        </h2>
      </motion.div>

      <div className='mt-20 flex flex-col'>
        <VerticalTimeline>
          {publications.map((publication, index) => (
            <PublicationCard
              key={`publication-${index}`}
              publication={publication}
            />
          ))}
        </VerticalTimeline>
      </div>
    </>
  );
};

export default SectionWrapper(Publications, "publications");
