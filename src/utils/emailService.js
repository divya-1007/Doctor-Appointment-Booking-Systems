const fs = require("fs");
const path = require("path");
const handlebar = require("handlebars");
const nodemailer = require("nodemailer");
// qxdujecsoudvqznj
const AVAILABLETEMPLATES = {
  CONTACT_INFORMATION: "singUp",
  ENQUIRE_FLEXI: "enquire-flexi"
};

class Email {
  constructor(template = "") {
    this.body = "";
    this.subject = "";
    this.cc = [];
    if (template) {
      this.setTemplate(template);
    }
  }

  setTemplate(template) {
    if (!Object.values(AVAILABLETEMPLATES).includes(template)) {
      throw new Error("Invalid template");
    }

    this.template = template;
    switch (template) {
      case AVAILABLETEMPLATES.CONTACT_INFORMATION:
        this.subject = "Contact Us Successfully ";
        break;
      case AVAILABLETEMPLATES.ENQUIRE_FLEXI:
        this.subject = "Enquire Flexi Successfully ";
        break;

      default:
        break;
    }
  }
  setBody(data) {
    if (!this.template) {
      throw new Error("Template not set");
    }
   
    if(data.type =='Enquire'){
      const fileBody = fs.readFileSync("./views/templates/"+ this.template+".hbs",{encoding: "utf8"} ).toString();
      const template = handlebar.compile(fileBody);

      this.body = template(data);

    }else{

    var fileBodys = fs.readFileSync("./views/templates/" + this.template + ".hbs", {encoding: "utf8"}).toString();
    const template = handlebar.compile(fileBodys);

      this.body = template(data);

    }

   
  }

  setRawBody(body) {
    this.body = body;
  }

  setSubject(subject) {
    this.subject = subject;
  }

  setCC(email) {
    this.cc = email;
  }

  async send(email) {
 
    if (!email) {
      throw new Error("Email not set");
    }
    if (!this.body || !this.subject) {
      throw new Error("Body or subject not set");
    }


    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: 'divyachourasiya.infograins@gmail.com', 
        pass: 'qxdujecsoudvqznj',
      },
    });

    const info = await transporter.sendMail({
      from: `"flexi-hub" <divyachourasiya.infograins@gmail.com>`,
      to: email,
      subject:this.subject,
      html: this.body,
    });
    
    return info;
  }

  static sendEmail(template, data, email, cc = []) {
    const emailClient = new Email(template);
    emailClient.setBody(data);
    emailClient.setSubject(template)
    return emailClient.send(email);
  }
}


module.exports = {
  Email,
  AVAILABLETEMPLATES
}