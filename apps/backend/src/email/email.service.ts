import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    // Si on a des variables d'env (Prod/Docker), on les utilise
    if (process.env.SMTP_HOST) {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
        console.log("📧 [EmailService] Configuration SMTP chargée depuis .env");
    } else {
        // SINON : On crée un compte de test Ethereal
        console.log("👻 [EmailService] Pas de config SMTP détectée, création d'un compte Ethereal...");
        
        nodemailer.createTestAccount().then((account) => {
            this.transporter = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass,
                },
            });
            console.log(`✨ [EmailService] Prêt ! Les emails seront visibles sur : https://ethereal.email/login`);
            console.log(`   User: ${account.user}`);
            console.log(`   Pass: ${account.pass}`);
        });
    }
  }

  async sendMail(to: string, subject: string, text: string, html: string) {
    console.log("📨 [EmailService] Envoi d’un mail à :", to);

    const info = await this.transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      text,
      html,
    });

    console.log("✅ [EmailService] Email envoyé, Message ID:", info.messageId);

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log("🔗 Aperçu Ethereal:", previewUrl);
    }

    return info;
  }

  // -------------------------------
  // Templates factorisés
  // -------------------------------

  private acceptTemplate(firstname: string, animalName: string): string {
    return `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          
          <!-- Header -->
          <header style="width:100%; background-color:#2D6A4F; padding:15px; text-align:center; color:#fff;">
            <h2 style="margin:0;">🐾 Pet Foster Connect</h2>
          </header>
      
          <!-- Body -->
          <div style="padding:20px;">
            <p>Bonjour <b>${firstname}</b>,</p>
            <p>
              Félicitations 🎉 ! Votre candidature pour l’animal <b>${animalName}</b> a été 
              <span style="color: green; font-weight: bold;">acceptée</span>.
            </p>
            <p>Nous vous contacterons rapidement pour organiser la suite du processus.</p>
            <div style="text-align:center; margin: 20px 0;">
              <a href="https://petfosterconnect.com/connexion"
                  style="display:inline-block; padding:12px 24px; background:#F28C28; color:#fff; text-decoration:none; border-radius:5px; font-weight:bold;">
                  Voir ma candidature
              </a>
            </div>
          </div>
      
          <!-- Footer -->
          <footer style="width:100%; background-color:#2D6A4F; padding:10px; text-align:center; color:#fff; font-size:12px;">
            Merci de contribuer au bien-être animal 🐶🐱<br/>
            Cet email est généré automatiquement par Pet Foster Connect.
          </footer>
        </div>
      `;
  }

  private rejectTemplate(firstname: string, animalName: string): string {
    return `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          
          <!-- Header -->
          <header style="width:100%; background-color:#2D6A4F; padding:15px; text-align:center; color:#fff;">
            <h2 style="margin:0;">🐾 Pet Foster Connect</h2>
          </header>
      
          <!-- Body -->
          <div style="padding:20px;">
            <p>Bonjour <b>${firstname}</b>,</p>
            <p>
              Nous sommes désolés 😔. Votre candidature pour l’animal <b>${animalName}</b> a été 
              <span style="color: red; font-weight: bold;">refusée</span>.
            </p>
            <p>
              N’hésitez pas à consulter nos autres animaux disponibles, peut-être qu’un futur compagnon vous attend.
            </p>
            <div style="text-align:center; margin: 20px 0;">
              <a href="https://petfosterconnect.com/animaux"
                  style="display:inline-block; padding:12px 24px; background:#F28C28; color:#fff; text-decoration:none; border-radius:5px; font-weight:bold;">
                  Voir les animaux disponibles
              </a>
            </div>
          </div>
      
          <!-- Footer -->
          <footer style="width:100%; background-color:#2D6A4F; padding:10px; text-align:center; color:#fff; font-size:12px;">
            Merci de votre intérêt et de votre engagement 🐾<br/>
            Cet email est généré automatiquement par Pet Foster Connect.
          </footer>
        </div>
      `;
      
  }

  // -------------------------------
  // Méthodes publiques
  // -------------------------------

  async sendAcceptanceEmail(to: string, firstname: string, animalName: string) {
    return this.sendMail(
      to,
      'Votre candidature a été acceptée',
      'Félicitations, votre demande a été validée !',
      this.acceptTemplate(firstname, animalName),
    );
  }

  async sendRejectionEmail(to: string, firstname: string, animalName: string) {
    return this.sendMail(
      to,
      'Votre candidature a été refusée',
      'Nous sommes désolés, votre demande n’a pas été retenue.',
      this.rejectTemplate(firstname, animalName),
    );
  }
}
