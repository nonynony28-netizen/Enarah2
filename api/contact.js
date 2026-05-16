import mongoose from 'mongoose'

const MONGO_URI =
  'ضع_رابط_MongoDB_هنا'

if (!mongoose.connections[0].readyState) {
  mongoose.connect(MONGO_URI)
}

// Schema
const ContactSchema =
  new mongoose.Schema(
    {
      name: String,
      phone: String,
      message: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
    {
      collection: 'contacts',
    }
  )

const Contact =
  mongoose.models.Contact ||
  mongoose.model(
    'Contact',
    ContactSchema
  )

export default async function handler(
  req,
  res
) {
  // POST فقط
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message:
        'Method Not Allowed',
    })
  }

  try {
    const {
      name,
      phone,
      message,
    } = req.body

    // تحقق من الحقول
    if (
      !name ||
      !phone ||
      !message
    ) {
      return res.status(400).json({
        success: false,
        message:
          'جميع الحقول مطلوبة',
      })
    }

    // حفظ الرسالة
    const newMessage =
      await Contact.create({
        name,
        phone,
        message,
      })

    return res.status(200).json({
      success: true,
      message:
        'تم حفظ الرسالة بنجاح',
      data: newMessage,
    })
  } catch (error) {
    console.error(
      'Contact Save Error:',
      error
    )

    return res.status(500).json({
      success: false,
      message:
        'خطأ في السيرفر',
    })
  }
}
