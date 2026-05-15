// We use the ultra-secure Resend API instead of Nodemailer because Render blocks SMTP.
// This uses built-in fetch so we don't even need to install any new packages!

const sendEmail = async ({ email, subject, message, html }) => {
  try {
    const RESEND_API_KEY = 're_FfCvy36U_HAW9YPYZDwtyas4We1KGFDkq';
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'CampusSphere <onboarding@resend.dev>', // Free tier sandbox email
        to: email, // IMPORTANT: Since this is a free sandbox, it will ONLY send to your registered email!
        subject: subject,
        html: html || `<p>${message}</p>`
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Secure Email sent successfully via Resend API!');
      return true;
    } else {
      console.error('❌ Resend API Error:', data);
      return false;
    }
  } catch (error) {
    console.error('❌ Fetch Error while sending email:', error);
    return false;
  }
};

module.exports = sendEmail;
