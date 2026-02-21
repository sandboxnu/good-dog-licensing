export function buttonCard(options: {
  text: string;
  buttonText: string;
  buttonHref: string;
}) {
  const { text, buttonText, buttonHref } = options;

  return `
    <table width="100%" cellpadding="0" cellspacing="0"
      style="margin:24px 0;background-color:#ffffff;border-radius:12px;">
      <tr>
        <td style="
            padding:28px;
            border:1px solid #e5e7eb;
            border-radius:12px;
            text-align:center;
        ">

          <p style="margin:0 0 20px;color:#374151;font-size:16px;">
            ${text}
          </p>

          <table align="center" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center" bgcolor="#166534"
                  style="border-radius:8px;">
                <a href="${buttonHref}"
                   style="
                     display:inline-block;
                     padding:12px 26px;
                     font-size:14px;
                     font-weight:600;
                     color:#ffffff;
                     text-decoration:none;
                     border-radius:8px;
                   ">
                  ${buttonText}
                </a>
              </td>
            </tr>
          </table>

        </td>
      </tr>
    </table>
  `;
}
