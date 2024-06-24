import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Container,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  verificationCode: string;
}

export default function VerificationEmail({
  username,
  verificationCode,
}: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Silhouette Verification Code</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        <style>
          {`
            body, html {
              margin: 0;
              padding: 0;
              background-color: #f6f6f6;
              font-family: Roboto, Verdana, sans-serif;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
              border: 1px solid #ddd;
              border-radius: 8px;
            }
            .heading {
              font-size: 24px;
              font-weight: bold;
              color: #333;
              margin-bottom: 20px;
            }
            .text {
              font-size: 16px;
              color: #555;
              line-height: 1.5;
              margin-bottom: 20px;
            }
            .code {
              font-size: 20px;
              font-weight: bold;
              color: #333;
              background-color: #f0f0f0;
              padding: 10px;
              border-radius: 4px;
              display: inline-block;
              margin-bottom: 20px;
              text-align: center;
            }
            .footer {
              font-size: 14px;
              color: #777;
              margin-top: 20px;
              text-align: left;
            }
          `}
        </style>
      </Head>
      <Preview>Your verification code: {verificationCode}</Preview>
      <Section>
        <Container className="container">
          <Row>
            <Heading className="heading">Hello {username},</Heading>
          </Row>
          <Row>
            <Text className="text">
              Thank you for registering on Silhouette! Please use the following verification code to complete your registration. If you did not request this code, please ignore this email.
            </Text>
          </Row>  
          <Row>
            <Text className="code">{verificationCode}</Text>
          </Row>
          <Row className="footer">
            <Text className="text">Regards,</Text>
            <Text className="text">Anurag Parashar Sarmah</Text>
            <Text className="text">Developer at OnClique</Text>
          </Row>
        </Container>
      </Section>
    </Html>
  );
}