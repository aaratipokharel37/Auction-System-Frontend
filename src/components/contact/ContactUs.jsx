import React, { useState } from 'react'
import { Send } from 'lucide-react'

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setSubmitted(true)
  }

  const inputClass =
    'w-full bg-[#1e2028] border border-[#2a2d35] rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/10 transition-all'

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-[#0a0a0a]">
      <div className="w-full max-w-xl bg-[#16181d] border border-[#2a2d35] rounded-2xl p-10">

        <div className="mb-8">
          <span className="inline-block bg-yellow-500/10 text-yellow-500 border border-yellow-500/25 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            Get in touch
          </span>
          <h1 className="text-2xl font-bold text-white mb-2">
            Contact <span className="text-yellow-500">Us</span>
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            Have a question? We'd love to hear from you.
          </p>
        </div>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center mx-auto mb-4">
              <Send className="w-5 h-5 text-yellow-500" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Message Sent!</h3>
            <p className="text-gray-500 text-sm">
              Thank you for reaching out. We'll get back to you within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Your Name</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="rambadahur" className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Your Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@gmail.com" className={inputClass} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Phone</label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+977 98XXXXXXXX" className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Subject</label>
                <input type="text" name="subject" value={form.subject} onChange={handleChange} placeholder="What is this regarding?" className={inputClass} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Message</label>
              <textarea name="message" value={form.message} onChange={handleChange} rows={5}
                placeholder="Describe your issue or question in detail..."
                className={`${inputClass} resize-none`}
              />
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={!form.name || !form.email || !form.message}
                className="bg-yellow-500 hover:bg-yellow-400 disabled:opacity-30 disabled:cursor-not-allowed text-black font-bold px-7 py-2.5 rounded-full transition-all flex items-center gap-2 text-sm"
              >
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  )
}

export default Contact