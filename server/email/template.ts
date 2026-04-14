export const staffVerificationTemplate = `
<div style="margin:0;padding:0;background:#f5f7fb;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f5f7fb;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e6eaf2;">
          <tr>
            <td style="padding:20px 24px;background:#0f172a;color:#ffffff;">
              <div style="font-size:16px;font-weight:700;letter-spacing:0.2px;">{{schoolName}}</div>

            </td>
          </tr>

          <tr>
            <td style="padding:24px;">
              <div style="font-size:18px;font-weight:700;color:#0f172a;margin:0 0 8px;">Verify your sign-in</div>
              <div style="font-size:14px;line-height:1.55;color:#334155;margin:0 0 16px;">
                Hi {{staffName}},<br/>
                Use the verification code below to complete your sign-up to the Traders Intelligence.
              </div>

              <div style="margin:18px 0 10px;text-align:center;">
                <div style="display:inline-block;background:#f1f5f9;border:1px solid #e2e8f0;border-radius:10px;padding:14px 18px;">
                  <div style="font-size:26px;letter-spacing:6px;font-weight:800;color:#0f172a;">{{code}}</div>
                </div>
              </div>

              <div style="font-size:13px;line-height:1.5;color:#475569;margin:0 0 16px;text-align:center;">
                This code expires in <strong>{{expiresIn}}</strong>.
              </div>

              <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;padding:12px 14px;margin-top:18px;">
                <div style="font-size:13px;color:#9a3412;font-weight:700;margin-bottom:4px;">Security tip</div>
                <div style="font-size:13px;color:#9a3412;line-height:1.45;">
                  If you didn’t request this code, you can ignore this email. Do not share this code with anyone.
                </div>
              </div>


            </td>
          </tr>

          <tr>
            <td style="padding:16px 24px;background:#f8fafc;border-top:1px solid #e6eaf2;">
              <div style="font-size:12px;color:#64748b;">
                © {{year}} {{schoolName}} •
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</div>
`;

export const staffWelcomeTemplate = `
<div style="margin:0;padding:0;background:#f5f7fb;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f5f7fb;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e6eaf2;">
          <tr>
            <td style="padding:20px 24px;background:#0f172a;color:#ffffff;">
              <div style="font-size:16px;font-weight:700;letter-spacing:0.2px;">{{schoolName}}</div>

            </td>
          </tr>

          <tr>
            <td style="padding:24px;">
              <div style="font-size:18px;font-weight:800;color:#0f172a;margin:0 0 8px;">
                Welcome, {{staffName}} 🎉
              </div>
              <div style="font-size:14px;line-height:1.55;color:#334155;margin:0 0 16px;">
              You can now start trading with Precision and keep track of your trades and attitudes while you trade.
              </div>



              <div style="text-align:center;margin:18px 0 10px;">
                <a href="{{portalUrl}}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:10px;font-weight:700;font-size:14px;">
                CONTINUE
                </a>
              </div>

              <div style="font-size:13px;line-height:1.5;color:#475569;text-align:center;margin:0 0 16px;">
                If the button doesn’t work, copy and paste this link into your browser:<br/>
                <span style="color:#2563eb;">{{portalUrl}}</span>
              </div>

              <div style="margin-top:18px;">
                <div style="font-size:13px;color:#0f172a;font-weight:800;margin-bottom:8px;">Next steps</div>
                <ul style="margin:0;padding-left:18px;color:#334155;font-size:13px;line-height:1.6;">
                  <li>Sign in using your email and password.</li>
                  <li>Confirm your profile details (if required).</li>
                  <li>Start managing  and journaling your trades .</li>
                </ul>
              </div>


            </td>
          </tr>

          <tr>
            <td style="padding:16px 24px;background:#f8fafc;border-top:1px solid #e6eaf2;">
              <div style="font-size:12px;color:#64748b;">
                © {{year}} {{schoolName}} • This is an automated message.
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</div>
`;
