import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { FAQ } from '../models/FAQ';
import { logger } from '../utils/logger';

dotenv.config();

const sampleFAQs = [
  // English FAQs
  {
    question: "What are the admission requirements for JECRC Foundation?",
    answer: "JECRC Foundation offers various courses with different admission requirements. For engineering courses, you need to qualify JEE Main or REAP. For management courses, you need to qualify CAT/MAT/CMAT. For other courses, admission is based on merit in the qualifying examination. Please visit our admissions office for detailed information.",
    language: "en",
    category: "admissions",
    keywords: ["admission", "requirements", "engineering", "management", "JEE", "CAT", "eligibility"]
  },
  {
    question: "What is the fee structure for different courses?",
    answer: "The fee structure varies by course and program. Engineering courses range from ₹80,000 to ₹1,20,000 per year. Management courses range from ₹70,000 to ₹1,00,000 per year. Fees include tuition, lab, library, and other charges. Scholarships and payment plans are available. For exact fees, please contact the admissions office.",
    language: "en",
    category: "fees",
    keywords: ["fees", "cost", "tuition", "payment", "scholarship", "engineering", "management"]
  },
  {
    question: "What scholarship programs are available?",
    answer: "JECRC Foundation offers merit-based scholarships up to 100% fee waiver for top performers. Need-based scholarships are available for economically disadvantaged students. Government scholarships like NSP are also facilitated. Sports scholarships are provided for state and national level players. Academic excellence scholarships are awarded to students maintaining high CGPA.",
    language: "en",
    category: "scholarships",
    keywords: ["scholarship", "merit", "need-based", "government", "sports", "academic", "fee waiver"]
  },
  {
    question: "What are the library facilities and timings?",
    answer: "Our central library is open from 8:00 AM to 10:00 PM on weekdays and 9:00 AM to 6:00 PM on weekends. It houses over 50,000 books, journals, and digital resources. Wi-Fi enabled reading areas, group study rooms, and digital library access are available. Students can borrow up to 5 books for 15 days.",
    language: "en",
    category: "library",
    keywords: ["library", "timings", "books", "wifi", "study", "digital", "borrow"]
  },
  {
    question: "What hostel facilities are provided?",
    answer: "JECRC provides separate hostels for boys and girls with modern amenities. Facilities include furnished rooms, mess with vegetarian meals, Wi-Fi, common rooms, gym, and 24/7 security. Hostel fees range from ₹60,000 to ₹80,000 per year including meals. Medical facilities and recreational activities are also available.",
    language: "en",
    category: "hostel",
    keywords: ["hostel", "accommodation", "boys", "girls", "mess", "wifi", "security", "medical"]
  },

  // Hindi FAQs
  {
    question: "JECRC Foundation में प्रवेश की आवश्यकताएं क्या हैं?",
    answer: "JECRC Foundation विभिन्न पाठ्यक्रमों के साथ अलग-अलग प्रवेश आवश्यकताएं प्रदान करता है। इंजीनियरिंग पाठ्यक्रमों के लिए, आपको JEE Main या REAP को उत्तीर्ण करना होगा। प्रबंधन पाठ्यक्रमों के लिए, आपको CAT/MAT/CMAT को उत्तीर्ण करना होगा। अन्य पाठ्यक्रमों के लिए, प्रवेश योग्यता परीक्षा में मेरिट के आधार पर होता है।",
    language: "hi",
    category: "admissions",
    keywords: ["प्रवेश", "आवश्यकताएं", "इंजीनियरिंग", "प्रबंधन", "JEE", "CAT", "योग्यता"]
  },
  {
    question: "विभिन्न पाठ्यक्रमों की फीस संरचना क्या है?",
    answer: "फीस संरचना पाठ्यक्रम और कार्यक्रम के अनुसार अलग होती है। इंजीनियरिंग पाठ्यक्रम ₹80,000 से ₹1,20,000 प्रति वर्ष तक हैं। प्रबंधन पाठ्यक्रम ₹70,000 से ₹1,00,000 प्रति वर्ष तक हैं। फीस में ट्यूशन, लैब, लाइब्रेरी और अन्य शुल्क शामिल हैं। छात्रवृत्ति और भुगतान योजनाएं उपलब्ध हैं।",
    language: "hi",
    category: "fees",
    keywords: ["फीस", "लागत", "ट्यूशन", "भुगतान", "छात्रवृत्ति", "इंजीनियरिंग", "प्रबंधन"]
  },
  {
    question: "कौन से छात्रवृत्ति कार्यक्रम उपलब्ध हैं?",
    answer: "JECRC Foundation टॉप परफॉर्मर्स के लिए 100% तक फीस माफी के साथ मेरिट-आधारित छात्रवृत्ति प्रदान करता है। आर्थिक रूप से कमजोर छात्रों के लिए जरूरत-आधारित छात्रवृत्ति उपलब्ध है। NSP जैसी सरकारी छात्रवृत्ति भी सुविधा प्रदान की जाती है। राज्य और राष्ट्रीय स्तर के खिलाड़ियों के लिए खेल छात्रवृत्ति प्रदान की जाती है।",
    language: "hi",
    category: "scholarships",
    keywords: ["छात्रवृत्ति", "मेरिट", "जरूरत-आधारित", "सरकारी", "खेल", "शैक्षणिक", "फीस माफी"]
  },

  // Rajasthani FAQs
  {
    question: "JECRC Foundation म्हैं दाखले की जरूरत क्या सै?",
    answer: "JECRC Foundation विभिन्न कोर्स अर अलग-अलग दाखला जरूरत प्रदान करै सै। इंजीनियरिंग कोर्स के लिए, थानै JEE Main या REAP पास करणो पड़ैगो। मैनेजमेंट कोर्स के लिए, थानै CAT/MAT/CMAT पास करणो पड़ैगो। दूजे कोर्स के लिए, दाखलो योग्यता परीक्षा म्हैं मेरिट के आधार पर होवै सै।",
    language: "raj",
    category: "admissions",
    keywords: ["दाखलो", "जरूरत", "इंजीनियरिंग", "मैनेजमेंट", "JEE", "CAT", "योग्यता"]
  },
  {
    question: "अलग-अलग कोर्स की फीस कितनी सै?",
    answer: "फीस कोर्स अर प्रोग्राम के हिसाब सूं अलग होवै सै। इंजीनियरिंग कोर्स ₹80,000 सूं ₹1,20,000 साल तक सै। मैनेजमेंट कोर्स ₹70,000 सूं ₹1,00,000 साल तक सै। फीस म्हैं ट्यूशन, लैब, लाइब्रेरी अर दूजे चार्ज शामिल सै। स्कॉलरशिप अर पेमेंट प्लान उपलब्ध सै।",
    language: "raj",
    category: "fees",
    keywords: ["फीस", "लागत", "ट्यूशन", "पेमेंट", "स्कॉलरशिप", "इंजीनियरिंग", "मैनेजमेंट"]
  },

  // More English FAQs
  {
    question: "What are the placement opportunities at JECRC?",
    answer: "JECRC has an excellent placement record with 85%+ placement rate. Top companies like TCS, Infosys, Wipro, Cognizant, Amazon, Microsoft visit for campus recruitment. Average package ranges from ₹3-6 LPA with highest packages going up to ₹25 LPA. Pre-placement training, mock interviews, and soft skills development programs are conducted regularly.",
    language: "en",
    category: "placements",
    keywords: ["placement", "companies", "TCS", "Infosys", "package", "recruitment", "training"]
  },
  {
    question: "What laboratory and research facilities are available?",
    answer: "JECRC has state-of-the-art laboratories for all engineering disciplines including Computer Science, Electronics, Mechanical, Civil, and Chemical labs. Research centers focus on AI/ML, IoT, Robotics, and Renewable Energy. Students get hands-on experience with latest equipment and software. Industry collaboration projects and research internships are also available.",
    language: "en",
    category: "facilities",
    keywords: ["laboratory", "research", "computer", "electronics", "AI", "ML", "IoT", "robotics"]
  },
  {
    question: "How can I contact JECRC for more information?",
    answer: "You can contact JECRC Foundation through multiple channels: Phone: +91-141-2770000, Email: info@jecrc.ac.in, Website: www.jecrc.ac.in. Our admissions office is open Monday to Saturday, 9:00 AM to 5:00 PM. Campus address: JECRC Foundation, Jaipur-Jodhpur Highway, Ramchapdra, Jaipur - 303905, Rajasthan.",
    language: "en",
    category: "contact",
    keywords: ["contact", "phone", "email", "address", "admissions", "office", "Jaipur"]
  }
];

async function seedFAQs() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sih-multilingual-chatbot');
    logger.info('Connected to MongoDB for seeding');

    // Clear existing FAQs
    await FAQ.deleteMany({});
    logger.info('Cleared existing FAQs');

    // Insert sample FAQs
    const insertedFAQs = await FAQ.insertMany(sampleFAQs);
    logger.info(`Inserted ${insertedFAQs.length} sample FAQs`);

    logger.info('FAQ seeding completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding FAQs:', error);
    process.exit(1);
  }
}

// Run the seeding function
if (require.main === module) {
  seedFAQs();
}

export { sampleFAQs, seedFAQs };