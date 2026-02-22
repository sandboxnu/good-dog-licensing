export function emailLayout(options: { title: string; content: string }) {
  const { title, content } = options;

  return `
      <div style="margin:0;padding:0;background-color:#e5e7eb;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#e5e7eb;padding:40px 0;">
          <tr>
            <td align="center">

              <table width="100%" cellpadding="0" cellspacing="0"
                style="max-width:600px;background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;border-collapse:collapse;">

                <!-- Header -->
                <tr>
                  <td style="background-color:#07634C;padding:32px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="40" valign="middle" style="padding-right:4px;">
                            <img 
                                src="localhost:3000/images/email_header_logo.png"
                                width="32"
                                height="32"
                                alt="Logo"
                                style="display:block;border:0;outline:none;text-decoration:none;"
                            />
                        </td>
                        <td style="color:#ffffff;font-size:24px;font-weight:600;font-family:'Afacad', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                          ${title}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:32px;background-color:#ffffff;color:#2E2E2E;font-size:20px;line-height:1.6;">
                    ${content}
                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>
      </div>
      `;
}
