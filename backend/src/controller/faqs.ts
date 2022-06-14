import { Request, Response, NextFunction } from 'express';
import { errorHandler } from '../utils/errorHandler';
import Jumbotron from '../models/jumbotron';
import Faqs from '../models/faqs';

export const getMiscData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [jumbotronData, faqsData] = await Promise.all([Jumbotron.find(), Faqs.find()]);
    res.status(200).json({ jumbotronData, faqsData });
  } catch (error) {
    errorHandler(error, next);
  }
};

// export const postFaq = async (
//   req: Request<{}, {}, faqs, {}>,
//   res: Response,
//   next: NextFunction
// ) => {
//   const title = req.body.title;
//   const subTitle = req.body.subTitle;
//   const image = req.body.image;
//   const alt = req.body.alt;
//   const direction = req.body.direction;
//   const faq = new Faqs({
//     title,
//     subTitle,
//     image,
//     alt,
//     direction,
//   });
//   try {
//     await faq.save();
//     res.status(200).json({ message: 'successful' });
//   } catch (error) {
//     errorHandler(error, next);
//   }
// };
