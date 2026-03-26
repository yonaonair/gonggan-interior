import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface InquiryData {
  name: string
  phone: string
  category: string
  location: string
  message: string
}

export async function sendInquiryAlert(data: InquiryData) {
  return resend.emails.send({
    from: 'onboarding@resend.dev', // 도메인 인증 후 변경
    to: process.env.ALERT_EMAIL!,
    subject: `[공간인테리어] 새 문의 — ${data.name} / ${data.category}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2a1a0e; border-bottom: 2px solid #b08060; padding-bottom: 8px;">
          새 문의가 접수되었습니다
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <tr><td style="padding: 8px 0; color: #7a4a30; width: 80px;">성함</td><td>${data.name}</td></tr>
          <tr><td style="padding: 8px 0; color: #7a4a30;">연락처</td><td><a href="tel:${data.phone}">${data.phone}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #7a4a30;">분야</td><td>${data.category}</td></tr>
          <tr><td style="padding: 8px 0; color: #7a4a30;">지역</td><td>${data.location}</td></tr>
          <tr><td style="padding: 8px 0; color: #7a4a30; vertical-align: top;">내용</td><td style="white-space: pre-wrap;">${data.message}</td></tr>
        </table>
        <p style="margin-top: 24px; font-size: 12px; color: #9a7a62;">
          공간인테리어 홈페이지 자동 발송 메일입니다.
        </p>
      </div>
    `,
  })
}
