import mongoose from 'mongoose'

const MONGO_URI =
  'ضع رابط MongoDB الحالي نفسه هنا'

if (!mongoose.connections[0].readyState) {
  mongoose.connect(MONGO_URI)
}

const UserSchema =
  new mongoose.Schema(
    {
      name: String,
      email: String,
      phone: String,
      type: {
        type: String,
        default: 'contact',
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
    {
      collection: 'users',
    }
  )

const User =
  mongoose.models.User ||
  mongoose.model(
    'User',
    UserSchema
  )

export default async function handler(
  req,
  res
) {
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

    // نفس قاعدة البيانات الحالية
    const newContact =
      await User.create({
        name,
        email: message, // نخزن الرسالة داخل email
        phone,
        type: 'contact',
      })

    return res.status(200).json({
      success: true,
      message:
        'تم حفظ الرسالة',
      data: newContact,
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
