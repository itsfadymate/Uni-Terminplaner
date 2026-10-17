import type { CohortSchedule } from '../types';
import { TIME_SLOTS } from '../constants';

export const SAMPLE_SCHEDULES: CohortSchedule[] = [
  {
    cohort: 'MET Msc V 1.6',
    fileName: 'MET_Msc_V_1.6.pdf',
    weeks: ['Teaching Week 3', 'Teaching Week 4'],
    entries: [
      // Week 3 - Tuesday (Exact match to university schedule)
      {
        day: 'Tuesday',
        dateStr: 'Tuesday, October 13, 2026',
        teachingWeek: 'Teaching Week 3',
        timeSlot: TIME_SLOTS[0],
        lecture: null,
      },
      {
        day: 'Tuesday',
        dateStr: 'Tuesday, October 13, 2026',
        teachingWeek: 'Teaching Week 3',
        timeSlot: TIME_SLOTS[1],
        lecture: null,
      },
      {
        day: 'Tuesday',
        dateStr: 'Tuesday, October 13, 2026',
        teachingWeek: 'Teaching Week 3',
        timeSlot: TIME_SLOTS[2],
        lecture: {
          name: 'Data Engineering and Visualization Lecture',
          room: '2.07',
          instructor: 'Dr. Amr Helmy + TA: Donia Ali',
          rawText: 'Data Engineering and Visualization Lecture (Dr. Amr Helmy + TA: Donia Ali)* 2.07',
        },
      },
      {
        day: 'Tuesday',
        dateStr: 'Tuesday, October 13, 2026',
        teachingWeek: 'Teaching Week 3',
        timeSlot: TIME_SLOTS[3],
        lecture: {
          name: 'Machine Learning Lecture',
          room: '3.16',
          instructor: 'Dr. Turker Ince + TA: Donia Ali',
          rawText: 'Machine Learning Lecture (Dr. Turker Ince + TA: Donia Ali)* 3.16',
        },
      },
      {
        day: 'Tuesday',
        dateStr: 'Tuesday, October 13, 2026',
        teachingWeek: 'Teaching Week 3',
        timeSlot: TIME_SLOTS[4],
        lecture: {
          name: 'Machine Learning Lab',
          room: '3.01',
          instructor: 'TA: Donia Ali',
          rawText: 'Machine Learning Lab (TA: Donia Ali)* 3.01',
        },
      },

      // Week 3 - Monday
      {
        day: 'Monday',
        dateStr: 'Monday, October 12, 2026',
        teachingWeek: 'Teaching Week 3',
        timeSlot: TIME_SLOTS[0],
        lecture: {
          name: 'Advanced Deep Learning Lecture',
          room: '2.07',
          instructor: 'Prof. Mueller',
          rawText: 'Advanced Deep Learning Lecture (Prof. Mueller) 2.07',
        },
      },
      {
        day: 'Monday',
        dateStr: 'Monday, October 12, 2026',
        teachingWeek: 'Teaching Week 3',
        timeSlot: TIME_SLOTS[1],
        lecture: {
          name: 'Advanced Deep Learning Seminar',
          room: '2.07',
          instructor: 'Prof. Mueller',
          rawText: 'Advanced Deep Learning Seminar (Prof. Mueller) 2.07',
        },
      },
      {
        day: 'Monday',
        dateStr: 'Monday, October 12, 2026',
        teachingWeek: 'Teaching Week 3',
        timeSlot: TIME_SLOTS[2],
        lecture: null,
      },
      {
        day: 'Monday',
        dateStr: 'Monday, October 12, 2026',
        teachingWeek: 'Teaching Week 3',
        timeSlot: TIME_SLOTS[3],
        lecture: null,
      },
      {
        day: 'Monday',
        dateStr: 'Monday, October 12, 2026',
        teachingWeek: 'Teaching Week 3',
        timeSlot: TIME_SLOTS[4],
        lecture: null,
      },

      // Week 3 - Wednesday
      {
        day: 'Wednesday',
        dateStr: 'Wednesday, October 14, 2026',
        teachingWeek: 'Teaching Week 3',
        timeSlot: TIME_SLOTS[0],
        lecture: null,
      },
      {
        day: 'Wednesday',
        dateStr: 'Wednesday, October 14, 2026',
        teachingWeek: 'Teaching Week 3',
        timeSlot: TIME_SLOTS[1],
        lecture: null,
      },
      {
        day: 'Wednesday',
        dateStr: 'Wednesday, October 14, 2026',
        teachingWeek: 'Teaching Week 3',
        timeSlot: TIME_SLOTS[2],
        lecture: {
          name: 'Research Methodologies in CS',
          room: '3.14',
          instructor: 'Dr. Schmidt',
          rawText: 'Research Methodologies in CS (Dr. Schmidt) 3.14',
        },
      },
      {
        day: 'Wednesday',
        dateStr: 'Wednesday, October 14, 2026',
        teachingWeek: 'Teaching Week 3',
        timeSlot: TIME_SLOTS[3],
        lecture: {
          name: 'Data Science & Big Data Systems',
          room: '2.07',
          instructor: 'Dr. Amr Helmy',
          rawText: 'Data Science & Big Data Systems (Dr. Amr Helmy) 2.07',
        },
      },
      {
        day: 'Wednesday',
        dateStr: 'Wednesday, October 14, 2026',
        teachingWeek: 'Teaching Week 3',
        timeSlot: TIME_SLOTS[4],
        lecture: null,
      },

      // Week 3 - Thursday
      {
        day: 'Thursday',
        dateStr: 'Thursday, October 15, 2026',
        teachingWeek: 'Teaching Week 3',
        timeSlot: TIME_SLOTS[0],
        lecture: {
          name: 'Cloud Computing & Distributed Systems',
          room: '3.16',
          instructor: 'Dr. Weber',
          rawText: 'Cloud Computing & Distributed Systems (Dr. Weber) 3.16',
        },
      },
      {
        day: 'Thursday',
        dateStr: 'Thursday, October 15, 2026',
        teachingWeek: 'Teaching Week 3',
        timeSlot: TIME_SLOTS[1],
        lecture: null,
      },
      {
        day: 'Thursday',
        dateStr: 'Thursday, October 15, 2026',
        teachingWeek: 'Teaching Week 3',
        timeSlot: TIME_SLOTS[2],
        lecture: null,
      },
      {
        day: 'Thursday',
        dateStr: 'Thursday, October 15, 2026',
        teachingWeek: 'Teaching Week 3',
        timeSlot: TIME_SLOTS[3],
        lecture: null,
      },
      {
        day: 'Thursday',
        dateStr: 'Thursday, October 15, 2026',
        teachingWeek: 'Teaching Week 3',
        timeSlot: TIME_SLOTS[4],
        lecture: null,
      },

      // Week 3 - Friday
      {
        day: 'Friday',
        dateStr: 'Friday, October 16, 2026',
        teachingWeek: 'Teaching Week 3',
        timeSlot: TIME_SLOTS[0],
        lecture: null,
      },
      {
        day: 'Friday',
        dateStr: 'Friday, October 16, 2026',
        teachingWeek: 'Teaching Week 3',
        timeSlot: TIME_SLOTS[1],
        lecture: null,
      },
      {
        day: 'Friday',
        dateStr: 'Friday, October 16, 2026',
        teachingWeek: 'Teaching Week 3',
        timeSlot: TIME_SLOTS[2],
        lecture: null,
      },
      {
        day: 'Friday',
        dateStr: 'Friday, October 16, 2026',
        teachingWeek: 'Teaching Week 3',
        timeSlot: TIME_SLOTS[3],
        lecture: null,
      },
      {
        day: 'Friday',
        dateStr: 'Friday, October 16, 2026',
        teachingWeek: 'Teaching Week 3',
        timeSlot: TIME_SLOTS[4],
        lecture: null,
      },

      // Week 3 - Saturday
      {
        day: 'Saturday',
        dateStr: 'Saturday, October 17, 2026',
        teachingWeek: 'Teaching Week 3',
        timeSlot: TIME_SLOTS[0],
        lecture: null,
      },
      {
        day: 'Saturday',
        dateStr: 'Saturday, October 17, 2026',
        teachingWeek: 'Teaching Week 3',
        timeSlot: TIME_SLOTS[1],
        lecture: null,
      },
      {
        day: 'Saturday',
        dateStr: 'Saturday, October 17, 2026',
        teachingWeek: 'Teaching Week 3',
        timeSlot: TIME_SLOTS[2],
        lecture: null,
      },
      {
        day: 'Saturday',
        dateStr: 'Saturday, October 17, 2026',
        teachingWeek: 'Teaching Week 3',
        timeSlot: TIME_SLOTS[3],
        lecture: null,
      },
      {
        day: 'Saturday',
        dateStr: 'Saturday, October 17, 2026',
        teachingWeek: 'Teaching Week 3',
        timeSlot: TIME_SLOTS[4],
        lecture: null,
      },

      // Week 4 - Monday (Oct 19, 2026)
      {
        day: 'Monday',
        dateStr: 'Monday, October 19, 2026',
        teachingWeek: 'Teaching Week 4',
        timeSlot: TIME_SLOTS[0],
        lecture: {
          name: 'Advanced Deep Learning Lecture',
          room: '2.07',
          instructor: 'Prof. Mueller',
          rawText: 'Advanced Deep Learning Lecture (Prof. Mueller) 2.07',
        },
      },
      {
        day: 'Monday',
        dateStr: 'Monday, October 19, 2026',
        teachingWeek: 'Teaching Week 4',
        timeSlot: TIME_SLOTS[1],
        lecture: {
          name: 'Advanced Deep Learning Seminar',
          room: '2.07',
          instructor: 'Prof. Mueller',
          rawText: 'Advanced Deep Learning Seminar (Prof. Mueller) 2.07',
        },
      },
      { day: 'Monday', dateStr: 'Monday, October 19, 2026', teachingWeek: 'Teaching Week 4', timeSlot: TIME_SLOTS[2], lecture: null },
      { day: 'Monday', dateStr: 'Monday, October 19, 2026', teachingWeek: 'Teaching Week 4', timeSlot: TIME_SLOTS[3], lecture: null },
      { day: 'Monday', dateStr: 'Monday, October 19, 2026', teachingWeek: 'Teaching Week 4', timeSlot: TIME_SLOTS[4], lecture: null },

      // Week 4 - Tuesday (Oct 20, 2026)
      { day: 'Tuesday', dateStr: 'Tuesday, October 20, 2026', teachingWeek: 'Teaching Week 4', timeSlot: TIME_SLOTS[0], lecture: null },
      { day: 'Tuesday', dateStr: 'Tuesday, October 20, 2026', teachingWeek: 'Teaching Week 4', timeSlot: TIME_SLOTS[1], lecture: null },
      {
        day: 'Tuesday',
        dateStr: 'Tuesday, October 20, 2026',
        teachingWeek: 'Teaching Week 4',
        timeSlot: TIME_SLOTS[2],
        lecture: {
          name: 'Data Engineering and Visualization Lecture',
          room: '2.07',
          instructor: 'Dr. Amr Helmy + TA: Donia Ali',
          rawText: 'Data Engineering and Visualization Lecture (Dr. Amr Helmy + TA: Donia Ali)* 2.07',
        },
      },
      {
        day: 'Tuesday',
        dateStr: 'Tuesday, October 20, 2026',
        teachingWeek: 'Teaching Week 4',
        timeSlot: TIME_SLOTS[3],
        lecture: {
          name: 'Machine Learning Lecture',
          room: '3.16',
          instructor: 'Dr. Turker Ince + TA: Donia Ali',
          rawText: 'Machine Learning Lecture (Dr. Turker Ince + TA: Donia Ali)* 3.16',
        },
      },
      {
        day: 'Tuesday',
        dateStr: 'Tuesday, October 20, 2026',
        teachingWeek: 'Teaching Week 4',
        timeSlot: TIME_SLOTS[4],
        lecture: {
          name: 'Machine Learning Lab',
          room: '3.01',
          instructor: 'TA: Donia Ali',
          rawText: 'Machine Learning Lab (TA: Donia Ali)* 3.01',
        },
      },

      // Week 4 - Wednesday (Oct 21, 2026)
      { day: 'Wednesday', dateStr: 'Wednesday, October 21, 2026', teachingWeek: 'Teaching Week 4', timeSlot: TIME_SLOTS[0], lecture: null },
      { day: 'Wednesday', dateStr: 'Wednesday, October 21, 2026', teachingWeek: 'Teaching Week 4', timeSlot: TIME_SLOTS[1], lecture: null },
      {
        day: 'Wednesday',
        dateStr: 'Wednesday, October 21, 2026',
        teachingWeek: 'Teaching Week 4',
        timeSlot: TIME_SLOTS[2],
        lecture: {
          name: 'Research Methodologies in CS',
          room: '3.14',
          instructor: 'Dr. Schmidt',
          rawText: 'Research Methodologies in CS (Dr. Schmidt) 3.14',
        },
      },
      {
        day: 'Wednesday',
        dateStr: 'Wednesday, October 21, 2026',
        teachingWeek: 'Teaching Week 4',
        timeSlot: TIME_SLOTS[3],
        lecture: {
          name: 'Data Science & Big Data Systems',
          room: '2.07',
          instructor: 'Dr. Amr Helmy',
          rawText: 'Data Science & Big Data Systems (Dr. Amr Helmy) 2.07',
        },
      },
      { day: 'Wednesday', dateStr: 'Wednesday, October 21, 2026', teachingWeek: 'Teaching Week 4', timeSlot: TIME_SLOTS[4], lecture: null },

      // Week 4 - Thursday (Oct 22, 2026)
      {
        day: 'Thursday',
        dateStr: 'Thursday, October 22, 2026',
        teachingWeek: 'Teaching Week 4',
        timeSlot: TIME_SLOTS[0],
        lecture: {
          name: 'Cloud Computing & Distributed Systems',
          room: '3.16',
          instructor: 'Dr. Weber',
          rawText: 'Cloud Computing & Distributed Systems (Dr. Weber) 3.16',
        },
      },
      { day: 'Thursday', dateStr: 'Thursday, October 22, 2026', teachingWeek: 'Teaching Week 4', timeSlot: TIME_SLOTS[1], lecture: null },
      { day: 'Thursday', dateStr: 'Thursday, October 22, 2026', teachingWeek: 'Teaching Week 4', timeSlot: TIME_SLOTS[2], lecture: null },
      { day: 'Thursday', dateStr: 'Thursday, October 22, 2026', teachingWeek: 'Teaching Week 4', timeSlot: TIME_SLOTS[3], lecture: null },
      { day: 'Thursday', dateStr: 'Thursday, October 22, 2026', teachingWeek: 'Teaching Week 4', timeSlot: TIME_SLOTS[4], lecture: null },

      // Week 4 - Friday (Oct 23, 2026)
      { day: 'Friday', dateStr: 'Friday, October 23, 2026', teachingWeek: 'Teaching Week 4', timeSlot: TIME_SLOTS[0], lecture: null },
      { day: 'Friday', dateStr: 'Friday, October 23, 2026', teachingWeek: 'Friday, October 23, 2026', timeSlot: TIME_SLOTS[1], lecture: null },
      { day: 'Friday', dateStr: 'Friday, October 23, 2026', teachingWeek: 'Friday, October 23, 2026', timeSlot: TIME_SLOTS[2], lecture: null },
      { day: 'Friday', dateStr: 'Friday, October 23, 2026', teachingWeek: 'Friday, October 23, 2026', timeSlot: TIME_SLOTS[3], lecture: null },
      { day: 'Friday', dateStr: 'Friday, October 23, 2026', teachingWeek: 'Friday, October 23, 2026', timeSlot: TIME_SLOTS[4], lecture: null },

      // Week 4 - Saturday (Oct 24, 2026)
      { day: 'Saturday', dateStr: 'Saturday, October 24, 2026', teachingWeek: 'Teaching Week 4', timeSlot: TIME_SLOTS[0], lecture: null },
      { day: 'Saturday', dateStr: 'Saturday, October 24, 2026', teachingWeek: 'Teaching Week 4', timeSlot: TIME_SLOTS[1], lecture: null },
      { day: 'Saturday', dateStr: 'Saturday, October 24, 2026', teachingWeek: 'Teaching Week 4', timeSlot: TIME_SLOTS[2], lecture: null },
      { day: 'Saturday', dateStr: 'Saturday, October 24, 2026', teachingWeek: 'Teaching Week 4', timeSlot: TIME_SLOTS[3], lecture: null },
      { day: 'Saturday', dateStr: 'Saturday, October 24, 2026', teachingWeek: 'Teaching Week 4', timeSlot: TIME_SLOTS[4], lecture: null },
    ],
  },
  {
    cohort: '9MET',
    fileName: '9MET_Schedule_WS26.pdf',
    weeks: ['Teaching Week 3'],
    entries: [
      {
        day: 'Monday',
        dateStr: 'Monday, October 12, 2026',
        teachingWeek: 'Teaching Week 3',
        timeSlot: TIME_SLOTS[0],
        lecture: {
          name: 'Computer Graphics Lecture',
          room: '3.16',
          instructor: 'Dr. Tamer',
          rawText: 'Computer Graphics Lecture (Dr. Tamer) 3.16',
        },
      },
      {
        day: 'Monday',
        dateStr: 'Monday, October 12, 2026',
        teachingWeek: 'Teaching Week 3',
        timeSlot: TIME_SLOTS[1],
        lecture: {
          name: 'Computer Graphics Lab',
          room: '3.01',
          instructor: 'Eng. Sarah',
          rawText: 'Computer Graphics Lab (Eng. Sarah) 3.01',
        },
      },
      { day: 'Monday', dateStr: 'Monday, October 12, 2026', teachingWeek: 'Teaching Week 3', timeSlot: TIME_SLOTS[2], lecture: null },
      { day: 'Monday', dateStr: 'Monday, October 12, 2026', teachingWeek: 'Teaching Week 3', timeSlot: TIME_SLOTS[3], lecture: null },
      { day: 'Monday', dateStr: 'Monday, October 12, 2026', teachingWeek: 'Teaching Week 3', timeSlot: TIME_SLOTS[4], lecture: null },

      // Tuesday
      { day: 'Tuesday', dateStr: 'Tuesday, October 13, 2026', teachingWeek: 'Teaching Week 3', timeSlot: TIME_SLOTS[0], lecture: null },
      { day: 'Tuesday', dateStr: 'Tuesday, October 13, 2026', teachingWeek: 'Teaching Week 3', timeSlot: TIME_SLOTS[1], lecture: null },
      {
        day: 'Tuesday',
        dateStr: 'Tuesday, October 13, 2026',
        teachingWeek: 'Teaching Week 3',
        timeSlot: TIME_SLOTS[2],
        lecture: {
          name: 'Data Engineering and Visualization Lecture',
          room: '2.07',
          instructor: 'Dr. Amr Helmy + TA: Donia Ali',
          rawText: 'Data Engineering and Visualization Lecture (Dr. Amr Helmy + TA: Donia Ali)* 2.07',
        },
      },
      {
        day: 'Tuesday',
        dateStr: 'Tuesday, October 13, 2026',
        teachingWeek: 'Teaching Week 3',
        timeSlot: TIME_SLOTS[3],
        lecture: {
          name: 'Machine Learning Lecture',
          room: '3.16',
          instructor: 'Dr. Turker Ince + TA: Donia Ali',
          rawText: 'Machine Learning Lecture (Dr. Turker Ince + TA: Donia Ali)* 3.16',
        },
      },
      {
        day: 'Tuesday',
        dateStr: 'Tuesday, October 13, 2026',
        teachingWeek: 'Teaching Week 3',
        timeSlot: TIME_SLOTS[4],
        lecture: {
          name: 'Machine Learning Lab',
          room: '3.01',
          instructor: 'TA: Donia Ali',
          rawText: 'Machine Learning Lab (TA: Donia Ali)* 3.01',
        },
      },

      // Wednesday
      {
        day: 'Wednesday',
        dateStr: 'Wednesday, October 14, 2026',
        teachingWeek: 'Teaching Week 3',
        timeSlot: TIME_SLOTS[0],
        lecture: {
          name: 'Advanced Software Engineering',
          room: '2.07',
          instructor: 'Dr. Hany',
          rawText: 'Advanced Software Engineering (Dr. Hany) 2.07',
        },
      },
      {
        day: 'Wednesday',
        dateStr: 'Wednesday, October 14, 2026',
        teachingWeek: 'Teaching Week 3',
        timeSlot: TIME_SLOTS[1],
        lecture: {
          name: 'Software Engineering Tutorial',
          room: '2.03',
          instructor: 'TA: Omar',
          rawText: 'Software Engineering Tutorial (TA: Omar) 2.03',
        },
      },
      { day: 'Wednesday', dateStr: 'Wednesday, October 14, 2026', teachingWeek: 'Teaching Week 3', timeSlot: TIME_SLOTS[2], lecture: null },
      { day: 'Wednesday', dateStr: 'Wednesday, October 14, 2026', teachingWeek: 'Teaching Week 3', timeSlot: TIME_SLOTS[3], lecture: null },
      { day: 'Wednesday', dateStr: 'Wednesday, October 14, 2026', teachingWeek: 'Teaching Week 3', timeSlot: TIME_SLOTS[4], lecture: null },

      // Thursday
      { day: 'Thursday', dateStr: 'Thursday, October 15, 2026', teachingWeek: 'Teaching Week 3', timeSlot: TIME_SLOTS[0], lecture: null },
      {
        day: 'Thursday',
        dateStr: 'Thursday, October 15, 2026',
        teachingWeek: 'Teaching Week 3',
        timeSlot: TIME_SLOTS[1],
        lecture: {
          name: 'Human-Computer Interaction',
          room: '3.16',
          instructor: 'Dr. Layla',
          rawText: 'Human-Computer Interaction (Dr. Layla) 3.16',
        },
      },
      {
        day: 'Thursday',
        dateStr: 'Thursday, October 15, 2026',
        teachingWeek: 'Teaching Week 3',
        timeSlot: TIME_SLOTS[2],
        lecture: {
          name: 'HCI Lab',
          room: '3.01',
          instructor: 'TA: Youssef',
          rawText: 'HCI Lab (TA: Youssef) 3.01',
        },
      },
      { day: 'Thursday', dateStr: 'Thursday, October 15, 2026', teachingWeek: 'Teaching Week 3', timeSlot: TIME_SLOTS[3], lecture: null },
      { day: 'Thursday', dateStr: 'Thursday, October 15, 2026', teachingWeek: 'Teaching Week 3', timeSlot: TIME_SLOTS[4], lecture: null },

      // Friday
      { day: 'Friday', dateStr: 'Friday, October 16, 2026', teachingWeek: 'Teaching Week 3', timeSlot: TIME_SLOTS[0], lecture: null },
      { day: 'Friday', dateStr: 'Friday, October 16, 2026', teachingWeek: 'Teaching Week 3', timeSlot: TIME_SLOTS[1], lecture: null },
      { day: 'Friday', dateStr: 'Friday, October 16, 2026', teachingWeek: 'Teaching Week 3', timeSlot: TIME_SLOTS[2], lecture: null },
      { day: 'Friday', dateStr: 'Friday, October 16, 2026', teachingWeek: 'Teaching Week 3', timeSlot: TIME_SLOTS[3], lecture: null },
      { day: 'Friday', dateStr: 'Friday, October 16, 2026', teachingWeek: 'Teaching Week 3', timeSlot: TIME_SLOTS[4], lecture: null },

      // Saturday
      { day: 'Saturday', dateStr: 'Saturday, October 17, 2026', teachingWeek: 'Teaching Week 3', timeSlot: TIME_SLOTS[0], lecture: null },
      { day: 'Saturday', dateStr: 'Saturday, October 17, 2026', teachingWeek: 'Teaching Week 3', timeSlot: TIME_SLOTS[1], lecture: null },
      { day: 'Saturday', dateStr: 'Saturday, October 17, 2026', teachingWeek: 'Teaching Week 3', timeSlot: TIME_SLOTS[2], lecture: null },
      { day: 'Saturday', dateStr: 'Saturday, October 17, 2026', teachingWeek: 'Teaching Week 3', timeSlot: TIME_SLOTS[3], lecture: null },
      { day: 'Saturday', dateStr: 'Saturday, October 17, 2026', teachingWeek: 'Teaching Week 3', timeSlot: TIME_SLOTS[4], lecture: null },
    ],
  },
  {
    cohort: 'CS Year 3',
    fileName: 'CS_Year3_WS26.pdf',
    weeks: ['Teaching Week 3'],
    entries: [
      {
        day: 'Monday',
        dateStr: 'Monday, October 12, 2026',
        teachingWeek: 'Teaching Week 3',
        timeSlot: TIME_SLOTS[2],
        lecture: {
          name: 'Operating Systems Lecture',
          room: '3.14',
          instructor: 'Dr. Becker',
          rawText: 'Operating Systems Lecture (Dr. Becker) 3.14',
        },
      },
      {
        day: 'Monday',
        dateStr: 'Monday, October 12, 2026',
        teachingWeek: 'Teaching Week 3',
        timeSlot: TIME_SLOTS[3],
        lecture: {
          name: 'Operating Systems Lab',
          room: '3.01',
          instructor: 'TA: Karim',
          rawText: 'Operating Systems Lab (TA: Karim) 3.01',
        },
      },
      {
        day: 'Tuesday',
        dateStr: 'Tuesday, October 13, 2026',
        teachingWeek: 'Teaching Week 3',
        timeSlot: TIME_SLOTS[1],
        lecture: {
          name: 'Database Management Systems',
          room: '2.07',
          instructor: 'Dr. Amr Helmy',
          rawText: 'Database Management Systems (Dr. Amr Helmy) 2.07',
        },
      },
      {
        day: 'Wednesday',
        dateStr: 'Wednesday, October 14, 2026',
        teachingWeek: 'Teaching Week 3',
        timeSlot: TIME_SLOTS[0],
        lecture: {
          name: 'Computer Networks',
          room: '3.16',
          instructor: 'Dr. Fischer',
          rawText: 'Computer Networks (Dr. Fischer) 3.16',
        },
      },
      {
        day: 'Thursday',
        dateStr: 'Thursday, October 15, 2026',
        teachingWeek: 'Teaching Week 3',
        timeSlot: TIME_SLOTS[3],
        lecture: {
          name: 'Compiler Design',
          room: '2.07',
          instructor: 'Prof. Hoffmann',
          rawText: 'Compiler Design (Prof. Hoffmann) 2.07',
        },
      },
    ],
  },
];

/** Standard GIU Berlin rooms */
export const KNOWN_GIU_ROOMS = [
  '2.01',
  '2.02',
  '2.03',
  '2.04',
  '2.05',
  '2.06',
  '2.07',
  '2.08',
  '3.01',
  '3.02',
  '3.03',
  '3.14',
  '3.15',
  '3.16',
];
