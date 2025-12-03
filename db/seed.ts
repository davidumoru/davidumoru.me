import { db, GuestBook, Stamps } from "astro:db";

const stampData = [
  {
    country: "United States",
    imageUrl:
      "http://res.cloudinary.com/deha0jqdf/image/upload/v1747352582/United_States_xom8ae.jpg",
    hue: 210,
  },
  {
    country: "India",
    imageUrl:
      "http://res.cloudinary.com/deha0jqdf/image/upload/v1747352590/India_xkavu4.jpg",
    hue: 30,
  },
  {
    country: "China",
    imageUrl:
      "http://res.cloudinary.com/deha0jqdf/image/upload/v1747352588/China_vp3tox.jpg",
    hue: 0,
  },
  {
    country: "United Kingdom",
    imageUrl:
      "http://res.cloudinary.com/deha0jqdf/image/upload/v1747352582/United_Kingdom_aog0xm.jpg",
    hue: 230,
  },
  {
    country: "Canada",
    imageUrl:
      "http://res.cloudinary.com/deha0jqdf/image/upload/v1747352587/Canada_wkha0g.jpg",
    hue: 355,
  },
  {
    country: "Germany",
    imageUrl:
      "http://res.cloudinary.com/deha0jqdf/image/upload/v1747352590/Germany_qsv4xr.jpg",
    hue: 50,
  },
  {
    country: "Brazil",
    imageUrl:
      "http://res.cloudinary.com/deha0jqdf/image/upload/v1747352582/Brazil_hy5ct1.jpg",
    hue: 120,
  },
  {
    country: "France",
    imageUrl:
      "http://res.cloudinary.com/deha0jqdf/image/upload/v1747352590/France_mmo2w6.jpg",
    hue: 220,
  },
  {
    country: "Russia",
    imageUrl:
      "http://res.cloudinary.com/deha0jqdf/image/upload/v1747352597/Russia_ga8wpl.jpg",
    hue: 5,
  },
  {
    country: "Australia",
    imageUrl:
      "http://res.cloudinary.com/deha0jqdf/image/upload/v1747352584/Australia_hjhape.jpg",
    hue: 215,
  },
  {
    country: "Mexico",
    imageUrl:
      "http://res.cloudinary.com/deha0jqdf/image/upload/v1747352595/Mexico_eib1am.jpg",
    hue: 130,
  },
  {
    country: "Japan",
    imageUrl:
      "http://res.cloudinary.com/deha0jqdf/image/upload/v1747352592/Japan_eqqjo0.jpg",
    hue: 350,
  },
  {
    country: "Philippines",
    imageUrl:
      "http://res.cloudinary.com/deha0jqdf/image/upload/v1747352596/Philippines_x3bvfi.jpg",
    hue: 240,
  },
  {
    country: "Indonesia",
    imageUrl:
      "http://res.cloudinary.com/deha0jqdf/image/upload/v1747352592/Indonesia_hgurr5.jpg",
    hue: 358,
  },
  {
    country: "Italy",
    imageUrl:
      "http://res.cloudinary.com/deha0jqdf/image/upload/v1747352593/Italy_qjn12f.jpg",
    hue: 110,
  },
  {
    country: "Nigeria",
    imageUrl:
      "http://res.cloudinary.com/deha0jqdf/image/upload/v1747352595/Nigeria_omtebx.jpg",
    hue: 125,
  },
  {
    country: "Pakistan",
    imageUrl:
      "http://res.cloudinary.com/deha0jqdf/image/upload/v1747352595/Pakistan_li48cw.jpg",
    hue: 140,
  },
  {
    country: "Turkey",
    imageUrl:
      "http://res.cloudinary.com/deha0jqdf/image/upload/v1747352582/Turkey_gfr00v.jpg",
    hue: 359,
  },
  {
    country: "South Korea",
    imageUrl:
      "http://res.cloudinary.com/deha0jqdf/image/upload/v1747352584/South_Korea_nr47pf.jpg",
    hue: 250,
  },
  {
    country: "Spain",
    imageUrl:
      "http://res.cloudinary.com/deha0jqdf/image/upload/v1747352585/Spain_zt2maj.jpg",
    hue: 45,
  },
  {
    country: "Netherlands",
    imageUrl:
      "http://res.cloudinary.com/deha0jqdf/image/upload/v1747352594/Netherlands_ztp1ir.jpg",
    hue: 25,
  },
  {
    country: "South Africa",
    imageUrl:
      "http://res.cloudinary.com/deha0jqdf/image/upload/v1747352582/South_Africa_xoj5ra.jpg",
    hue: 160,
  },
  {
    country: "Vietnam",
    imageUrl:
      "http://res.cloudinary.com/deha0jqdf/image/upload/v1747352586/Vietnam_xjln0s.webp",
    hue: 10,
  },
  {
    country: "Egypt",
    imageUrl:
      "http://res.cloudinary.com/deha0jqdf/image/upload/v1747352590/Egypt_efg2gi.jpg",
    hue: 40,
  },
  {
    country: "Bangladesh",
    imageUrl:
      "http://res.cloudinary.com/deha0jqdf/image/upload/v1747352584/Bangladesh_nq4n1y.jpg",
    hue: 135,
  },
  {
    country: "Ukraine",
    imageUrl:
      "http://res.cloudinary.com/deha0jqdf/image/upload/v1747352586/Ukraine_jftc9x.jpg",
    hue: 60,
  },
  {
    country: "Saudi Arabia",
    imageUrl:
      "http://res.cloudinary.com/deha0jqdf/image/upload/v1747352582/Saudi_Arabia_ce9xox.jpg",
    hue: 115,
  },
  {
    country: "Argentina",
    imageUrl:
      "http://res.cloudinary.com/deha0jqdf/image/upload/v1747352582/Argentina_d8hik9.jpg",
    hue: 195,
  },
  {
    country: "Poland",
    imageUrl:
      "http://res.cloudinary.com/deha0jqdf/image/upload/v1747352597/Poland_lcamf3.jpg",
    hue: 357,
  },
  {
    country: "Malaysia",
    imageUrl:
      "http://res.cloudinary.com/deha0jqdf/image/upload/v1747352593/Malaysia_wy2uty.jpg",
    hue: 55,
  },
  {
    country: "Norway",
    imageUrl:
      "http://res.cloudinary.com/deha0jqdf/image/upload/v1747352595/Norway_nzzdr5.jpg",
    hue: 205,
  },
  {
    country: "Turks and Caicos",
    imageUrl:
      "http://res.cloudinary.com/deha0jqdf/image/upload/v1747352585/Turks_and_Caicos_jwf6cm.jpg",
    hue: 175,
  },
  {
    country: "Seychelles",
    imageUrl:
      "http://res.cloudinary.com/deha0jqdf/image/upload/v1747352583/Seychelles_uqsrbs.jpg",
    hue: 190,
  },
  {
    country: "Croatia",
    imageUrl:
      "http://res.cloudinary.com/deha0jqdf/image/upload/v1747352588/Croatia_y8vjfs.jpg",
    hue: 15,
  },
  {
    country: "Portugal",
    imageUrl:
      "http://res.cloudinary.com/deha0jqdf/image/upload/v1747352598/Portugal_qhgknz.jpg",
    hue: 350,
  },
  {
    country: "Sweden",
    imageUrl:
      "http://res.cloudinary.com/deha0jqdf/image/upload/v1747352585/Sweden_egxgfq.jpg",
    hue: 200,
  },
  {
    country: "Morocco",
    imageUrl:
      "http://res.cloudinary.com/deha0jqdf/image/upload/v1747352595/Morocco_mgzgxl.jpg",
    hue: 20,
  },
  {
    country: "Colombia",
    imageUrl:
      "http://res.cloudinary.com/deha0jqdf/image/upload/v1747352588/Colombia_sujkij.jpg",
    hue: 70,
  },
  {
    country: "Chile",
    imageUrl:
      "http://res.cloudinary.com/deha0jqdf/image/upload/v1747352587/Chile_uvjiew.jpg",
    hue: 205,
  },
  {
    country: "Ireland",
    imageUrl:
      "http://res.cloudinary.com/deha0jqdf/image/upload/v1747352592/Ireland_imippd.jpg",
    hue: 140,
  },
  {
    country: "Mauritius",
    imageUrl:
      "http://res.cloudinary.com/deha0jqdf/image/upload/v1747352593/Mauritius_c5qju2.jpg",
    hue: 170,
  },
  {
    country: "Switzerland",
    imageUrl:
      "http://res.cloudinary.com/deha0jqdf/image/upload/v1747352582/Switzerland_sdm0wo.jpg",
    hue: 215,
  },
  {
    country: "Cameroon",
    imageUrl:
      "http://res.cloudinary.com/deha0jqdf/image/upload/v1747352584/Cameroon_z1wk8c.jpg",
    hue: 60,
  },
  {
    country: "Kenya",
    imageUrl:
      "http://res.cloudinary.com/deha0jqdf/image/upload/v1747352592/Kenya_iuoypd.jpg",
    hue: 40,
  },
  {
    country: "Ghana",
    imageUrl:
      "http://res.cloudinary.com/deha0jqdf/image/upload/v1747352591/Ghana_zmrgmi.jpg",
    hue: 210,
  },
  {
    country: "Ethiopia",
    imageUrl:
      "http://res.cloudinary.com/deha0jqdf/image/upload/v1747352590/Ethiopia_hoken5.jpg",
    hue: 25,
  },
  {
    country: "Senegal",
    imageUrl:
      "http://res.cloudinary.com/deha0jqdf/image/upload/v1747352582/Senegal_qkv1pm.jpg",
    hue: 220,
  },
  {
    country: "Algeria",
    imageUrl:
      "http://res.cloudinary.com/deha0jqdf/image/upload/v1747352581/Algeria_esqqmn.jpg",
    hue: 35,
  },
  {
    country: "United Arab Emirates",
    imageUrl:
      "https://res.cloudinary.com/deha0jqdf/image/upload/v1747584871/United_Arab_Emirates_dmcaiv.jpg",
    hue: 21,
  },
  {
    country: "Taiwan",
    imageUrl:
      "https://res.cloudinary.com/deha0jqdf/image/upload/v1748022435/Taiwan_k9ww99.webp",
    hue: 1,
  },
  {
    country: "Peru",
    imageUrl:
      "https://res.cloudinary.com/deha0jqdf/image/upload/v1748022436/Peru_wlckkl.webp",
    hue: 350,
  },
  {
    country: "Serbia",
    imageUrl:
      "https://res.cloudinary.com/deha0jqdf/image/upload/v1752708804/Serbia_mm6ah9.jpg",
    hue: 355,
  },
  { country: "Afghanistan", imageUrl: "", hue: 0 },
  { country: "Albania", imageUrl: "", hue: 0 },
  { country: "Andorra", imageUrl: "", hue: 220 },
  { country: "Angola", imageUrl: "", hue: 0 },
  { country: "Antigua and Barbuda", imageUrl: "", hue: 0 },
  { country: "Armenia", imageUrl: "", hue: 0 },
  { country: "Austria", imageUrl: "", hue: 0 },
  { country: "Azerbaijan", imageUrl: "", hue: 220 },
  { country: "Bahamas", imageUrl: "", hue: 195 },
  { country: "Bahrain", imageUrl: "", hue: 0 },
  { country: "Barbados", imageUrl: "", hue: 220 },
  { country: "Belarus", imageUrl: "", hue: 0 },
  { country: "Belgium", imageUrl: "", hue: 45 },
  { country: "Belize", imageUrl: "", hue: 220 },
  { country: "Benin", imageUrl: "", hue: 45 },
  { country: "Bhutan", imageUrl: "", hue: 45 },
  { country: "Bolivia", imageUrl: "", hue: 45 },
  { country: "Bosnia and Herzegovina", imageUrl: "", hue: 220 },
  { country: "Botswana", imageUrl: "", hue: 195 },
  { country: "Brunei", imageUrl: "", hue: 45 },
  { country: "Bulgaria", imageUrl: "", hue: 120 },
  { country: "Burkina Faso", imageUrl: "", hue: 0 },
  { country: "Burundi", imageUrl: "", hue: 45 },
  { country: "Cabo Verde", imageUrl: "", hue: 220 },
  { country: "Cambodia", imageUrl: "", hue: 220 },
  { country: "Central African Republic", imageUrl: "", hue: 45 },
  { country: "Chad", imageUrl: "", hue: 45 },
  { country: "Congo", imageUrl: "", hue: 120 },
  { country: "Costa Rica", imageUrl: "", hue: 220 },
  { country: "Czech Republic", imageUrl: "", hue: 220 },
  { country: "Denmark", imageUrl: "", hue: 0 },
  { country: "Djibouti", imageUrl: "", hue: 195 },
  { country: "Dominica", imageUrl: "", hue: 120 },
  { country: "Dominican Republic", imageUrl: "", hue: 220 },
  { country: "Ecuador", imageUrl: "", hue: 45 },
  { country: "El Salvador", imageUrl: "", hue: 220 },
  { country: "Equatorial Guinea", imageUrl: "", hue: 120 },
  { country: "Eritrea", imageUrl: "", hue: 0 },
  { country: "Estonia", imageUrl: "", hue: 220 },
  { country: "Eswatini", imageUrl: "", hue: 0 },
  { country: "Fiji", imageUrl: "", hue: 195 },
  { country: "Finland", imageUrl: "", hue: 220 },
  { country: "Gabon", imageUrl: "", hue: 120 },
  { country: "Gambia", imageUrl: "", hue: 45 },
  { country: "Georgia", imageUrl: "", hue: 0 },
  { country: "Greece", imageUrl: "", hue: 220 },
  { country: "Grenada", imageUrl: "", hue: 45 },
  { country: "Guatemala", imageUrl: "", hue: 195 },
  { country: "Guinea", imageUrl: "", hue: 45 },
  { country: "Guinea-Bissau", imageUrl: "", hue: 0 },
  { country: "Guyana", imageUrl: "", hue: 120 },
  { country: "Haiti", imageUrl: "", hue: 220 },
  { country: "Honduras", imageUrl: "", hue: 220 },
  { country: "Hungary", imageUrl: "", hue: 0 },
  { country: "Iceland", imageUrl: "", hue: 220 },
  { country: "Iran", imageUrl: "", hue: 120 },
  { country: "Iraq", imageUrl: "", hue: 45 },
  { country: "Israel", imageUrl: "", hue: 220 },
  { country: "Jamaica", imageUrl: "", hue: 120 },
  { country: "Jordan", imageUrl: "", hue: 0 },
  { country: "Kazakhstan", imageUrl: "", hue: 195 },
  { country: "Kiribati", imageUrl: "", hue: 0 },
  { country: "Kuwait", imageUrl: "", hue: 120 },
  { country: "Kyrgyzstan", imageUrl: "", hue: 220 },
  { country: "Laos", imageUrl: "", hue: 220 },
  { country: "Latvia", imageUrl: "", hue: 0 },
  { country: "Lebanon", imageUrl: "", hue: 0 },
  { country: "Lesotho", imageUrl: "", hue: 220 },
  { country: "Liberia", imageUrl: "", hue: 0 },
  { country: "Libya", imageUrl: "", hue: 120 },
  { country: "Liechtenstein", imageUrl: "", hue: 220 },
  { country: "Lithuania", imageUrl: "", hue: 45 },
  { country: "Luxembourg", imageUrl: "", hue: 220 },
  { country: "Madagascar", imageUrl: "", hue: 0 },
  { country: "Malawi", imageUrl: "", hue: 0 },
  { country: "Maldives", imageUrl: "", hue: 0 },
  { country: "Mali", imageUrl: "", hue: 45 },
  { country: "Malta", imageUrl: "", hue: 45 },
  { country: "Marshall Islands", imageUrl: "", hue: 220 },
  { country: "Mauritania", imageUrl: "", hue: 120 },
  { country: "Micronesia", imageUrl: "", hue: 195 },
  { country: "Moldova", imageUrl: "", hue: 220 },
  { country: "Monaco", imageUrl: "", hue: 0 },
  { country: "Mongolia", imageUrl: "", hue: 220 },
  { country: "Montenegro", imageUrl: "", hue: 220 },
  { country: "Mozambique", imageUrl: "", hue: 120 },
  { country: "Myanmar", imageUrl: "", hue: 45 },
  { country: "Namibia", imageUrl: "", hue: 220 },
  { country: "Nauru", imageUrl: "", hue: 220 },
  { country: "Nepal", imageUrl: "", hue: 0 },
  { country: "New Zealand", imageUrl: "", hue: 220 },
  { country: "Nicaragua", imageUrl: "", hue: 220 },
  { country: "Niger", imageUrl: "", hue: 45 },
  { country: "North Korea", imageUrl: "", hue: 0 },
  { country: "North Macedonia", imageUrl: "", hue: 0 },
  { country: "Oman", imageUrl: "", hue: 0 },
  { country: "Palau", imageUrl: "", hue: 195 },
  { country: "Palestine", imageUrl: "", hue: 120 },
  { country: "Panama", imageUrl: "", hue: 220 },
  { country: "Papua New Guinea", imageUrl: "", hue: 0 },
  { country: "Paraguay", imageUrl: "", hue: 220 },
  { country: "Qatar", imageUrl: "", hue: 0 },
  { country: "Romania", imageUrl: "", hue: 45 },
  { country: "Rwanda", imageUrl: "", hue: 45 },
  { country: "Saint Kitts and Nevis", imageUrl: "", hue: 120 },
  { country: "Saint Lucia", imageUrl: "", hue: 220 },
  { country: "Saint Vincent and the Grenadines", imageUrl: "", hue: 45 },
  { country: "Samoa", imageUrl: "", hue: 0 },
  { country: "San Marino", imageUrl: "", hue: 220 },
  { country: "Sao Tome and Principe", imageUrl: "", hue: 120 },
  { country: "Sierra Leone", imageUrl: "", hue: 120 },
  { country: "Singapore", imageUrl: "", hue: 0 },
  { country: "Slovakia", imageUrl: "", hue: 220 },
  { country: "Slovenia", imageUrl: "", hue: 220 },
  { country: "Solomon Islands", imageUrl: "", hue: 195 },
  { country: "Somalia", imageUrl: "", hue: 195 },
  { country: "South Sudan", imageUrl: "", hue: 120 },
  { country: "Sri Lanka", imageUrl: "", hue: 45 },
  { country: "Sudan", imageUrl: "", hue: 120 },
  { country: "Suriname", imageUrl: "", hue: 120 },
  { country: "Syria", imageUrl: "", hue: 0 },
  { country: "Tajikistan", imageUrl: "", hue: 0 },
  { country: "Tanzania", imageUrl: "", hue: 120 },
  { country: "Timor-Leste", imageUrl: "", hue: 0 },
  { country: "Togo", imageUrl: "", hue: 45 },
  { country: "Tonga", imageUrl: "", hue: 0 },
  { country: "Trinidad and Tobago", imageUrl: "", hue: 0 },
  { country: "Tunisia", imageUrl: "", hue: 0 },
  { country: "Turkmenistan", imageUrl: "", hue: 120 },
  { country: "Tuvalu", imageUrl: "", hue: 195 },
  { country: "Uganda", imageUrl: "", hue: 45 },
  { country: "Uruguay", imageUrl: "", hue: 195 },
  { country: "Uzbekistan", imageUrl: "", hue: 195 },
  { country: "Vanuatu", imageUrl: "", hue: 120 },
  { country: "Vatican City", imageUrl: "", hue: 45 },
  { country: "Venezuela", imageUrl: "", hue: 45 },
  { country: "Western Sahara", imageUrl: "", hue: 0 },
  { country: "Yemen", imageUrl: "", hue: 0 },
  { country: "Zambia", imageUrl: "", hue: 120 },
  { country: "Zimbabwe", imageUrl: "", hue: 45 },
  { country: "Kosovo", imageUrl: "", hue: 220 },
];

// https://astro.build/db/seed
export default async function seed() {
  await db.insert(Stamps).values(stampData);
  await db.insert(GuestBook).values([
    {
      author: "Alice Johnson",
      link: "https://alice.dev",
      content: "Love your work, keep it up!",
      country: "United States",
    },
    {
      author: "Ravi Kumar",
      link: "https://rkumar.blog",
      content: "Very interesting guestbook concept!",
      country: "India",
    },
    {
      author: "Li Wei",
      link: null,
      content: "Greetings from China!",
      country: "China",
    },
    {
      author: "Bob Smith",
      link: null,
      content: "Just dropping by to say hi!",
      country: "United Kingdom",
    },
    {
      author: "Gideon",
      link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      content: "This is so cool!",
      country: "Canada",
    },
    {
      author: "Frank Miller",
      link: null,
      content: "This guestbook idea is awesome!",
      country: "Germany",
    },
    {
      author: "Isabella Rossi",
      link: "https://isabellar.com",
      content: "Amazing job from Brazil!",
      country: "Brazil",
    },
    {
      author: "Eva Williams",
      link: "https://evaw.design",
      content: "As a designer, I really appreciate the aesthetics here.",
      country: "France",
    },
    {
      author: "Olga Petrova",
      link: null,
      content: "Nice website design from Russia.",
      country: "Russia",
    },
    {
      author: "Charlie Adams",
      link: "https://charlieadams.blog",
      content: "Great site from Down Under!",
      country: "Australia",
    },
    {
      author: "Carlos Garcia",
      link: "https://cgarcia.mx",
      content: "Saludos desde México!",
      country: "Mexico",
    },
    {
      author: "Kenji Tanaka",
      link: "https://ktanaka.jp",
      content: "Inspiring work from Japan!",
      country: "Japan",
    },
    {
      author: "Maria Santos",
      link: null,
      content: "Visiting from the Philippines!",
      country: "Philippines",
    },
    {
      author: "Budi Hartono",
      link: "https://budi.id",
      content: "Keep up the great work!",
      country: "Indonesia",
    },
    {
      author: "Marco Rossi",
      link: null,
      content: "Ciao! Love the guestbook.",
      country: "Italy",
    },
    {
      author: "David Umoru",
      link: "https://davidumoru.me",
      content: "Hey, welcome to my guestbook!",
      country: "Nigeria",
    },
    {
      author: "Ahmed Khan",
      link: "https://akhan.pk",
      content: "Greetings from Pakistan!",
      country: "Pakistan",
    },
    {
      author: "Ayse Yilmaz",
      link: null,
      content: "Merhaba from Turkey!",
      country: "Turkey",
    },
    {
      author: "Grace Lee",
      link: "https://gracecodes.dev",
      content: "Nice work! Looking forward to more updates from South Korea.",
      country: "South Korea",
    },
    {
      author: "Sofia Lopez",
      link: "https://slopez.es",
      content: "Hola! Impressive site from Spain.",
      country: "Spain",
    },
    {
      author: "Jan Jansen",
      link: null,
      content: "Groeten uit Nederland!",
      country: "Netherlands",
    },
    {
      author: "Thabo Muller",
      link: "https://tmuller.za",
      content: "Cool guestbook feature from South Africa!",
      country: "South Africa",
    },
    {
      author: "Nguyen Van An",
      link: null,
      content: "Xin chào from Vietnam!",
      country: "Vietnam",
    },
    {
      author: "Fatima Ali",
      link: "https://fali.eg",
      content: "Visiting from Egypt.",
      country: "Egypt",
    },
    {
      author: "Rahim Ahmed",
      link: null,
      content: "Good job on the site from Bangladesh.",
      country: "Bangladesh",
    },
    {
      author: "Ivan Ivanov",
      link: "https://ivanov.ua",
      content: "Sending support from Ukraine!",
      country: "Ukraine",
    },
    {
      author: "Abdullah Al-Fahad",
      link: null,
      content: "Salam from Saudi Arabia!",
      country: "Saudi Arabia",
    },
    {
      author: "Maria Fernandez",
      link: "https://mfernandez.ar",
      content: "Interesting project from Argentina!",
      country: "Argentina",
    },
    {
      author: "Piotr Nowak",
      link: null,
      content: "Cześć! Nice guestbook from Poland.",
      country: "Poland",
    },
    {
      author: "Siti Aminah",
      link: "https://siti.my",
      content: "Great to see projects like this from Malaysia!",
      country: "Malaysia",
    },
    {
      author: "Visitor From Norway",
      link: null,
      content: "Beautiful design, greetings from Norway!",
      country: "Norway",
    },
    {
      author: "Island Visitor",
      link: "https://example.com/turksandcaicos",
      content: "Lovely guestbook! - Turks and Caicos",
      country: "Turks and Caicos",
    },
    {
      author: "Seychelles Guest",
      link: null,
      content: "Signing in from Seychelles!",
      country: "Seychelles",
    },
    {
      author: "Croatian Friend",
      link: "https://example.com/croatia",
      content: "Pozdrav iz Hrvatske! (Greetings from Croatia!)",
      country: "Croatia",
    },
    {
      author: "Portuguese Explorer",
      link: null,
      content: "Olá! Great site.",
      country: "Portugal",
    },
    {
      author: "Swedish Supporter",
      link: "https://example.com/sweden",
      content: "Hej från Sverige!",
      country: "Sweden",
    },
    {
      author: "Moroccan Traveler",
      link: null,
      content: "Greetings from Morocco.",
      country: "Morocco",
    },
    {
      author: "Colombian Connection",
      link: "https://example.com/colombia",
      content: "Saludos desde Colombia!",
      country: "Colombia",
    },
    {
      author: "Chilean Observer",
      link: null,
      content: "Hola from Chile!",
      country: "Chile",
    },
    {
      author: "Irish Visitor",
      link: "https://example.com/ireland",
      content: "Top o' the mornin'! Nice guestbook.",
      country: "Ireland",
    },
    {
      author: "Mauritius Fan",
      link: null,
      content: "Visiting from Mauritius!",
      country: "Mauritius",
    },
    {
      author: "Swiss Guest",
      link: "https://example.com/switzerland",
      content: "Grüezi! Signing from Switzerland.",
      country: "Switzerland",
    },
    {
      author: "Cameroon Explorer",
      link: "https://example.com/cameroon",
      content: "Bonjour! Signing in from Cameroon.",
      country: "Cameroon",
    },
    {
      author: "Safari Enthusiast",
      link: null,
      content: "Jambo! Greetings from beautiful Kenya.",
      country: "Kenya",
    },
    {
      author: "Accra Visitor",
      link: "https://example.com/ghana",
      content: "Akwaaba! Enjoying my time in Ghana.",
      country: "Ghana",
    },
    {
      author: "Lalibela Admirer",
      link: null,
      content: "Selam! Sending greetings from Ethiopia.",
      country: "Ethiopia",
    },
    {
      author: "Dakar Resident",
      link: "https://example.com/senegal",
      content: "Salam! Greetings from Senegal.",
      country: "Senegal",
    },
    {
      author: "Algerian Friend",
      link: null,
      content: "As-salamu alaykum! Visiting from Algeria.",
      country: "Algeria",
    },
    {
      author: "Ali",
      link: null,
      content: "Sa'adt bi liqa'ak",
      country: "United Arab Emirates",
    },
    {
      author: "Taiwanese Visitor",
      link: "https://example.com/taiwan",
      content:
        "你好 (Nǐ hǎo)! This guestbook is as impressive as the view from Taipei 101.",
      country: "Taiwan",
    },
    {
      author: "Peruvian Visitor",
      link: "https://example.com/peru",
      content:
        "¡Hola! A pleasure to sign your guestbook. As breathtaking as the sight of Machu Picchu.",
      country: "Peru",
    },
    {
      author: "Serbian Guest",
      link: "https://example.com/serbia",
      content: "Greetings from Serbia!",
      country: "Serbia",
    },
    {
      author: "Greek Nomad",
      link: "https://example.com/greece",
      content:
        "From the Aegean with admiration. Your guestbook feels like a quiet Santorini evening.",
      country: "Greece",
    },
    {
      author: "Thai Traveler",
      link: "https://example.com/thailand",
      content:
        "Warm regards from Bangkok. This site radiates the serenity of a Thai sunrise.",
      country: "Thailand",
    },
    {
      author: "Singapore Soul",
      link: "https://example.com/singapore",
      content:
        "Tidy, bright, efficient—your site reminds me of Orchard Road at its best.",
      country: "Singapore",
    },
    {
      author: "Hungarian Guest",
      link: "https://example.com/hungary",
      content:
        "As delightful as a stroll by the Danube. Greetings from Budapest.",
      country: "Hungary",
    },
    {
      author: "Belgian Friend",
      link: "https://example.com/belgium",
      content: "Waffles, art, and this website—Belgium approves.",
      country: "Belgium",
    },
    {
      author: "Austrian Visitor",
      link: "https://example.com/austria",
      content:
        "Greetings from Vienna. This site has more harmony than a Mozart concerto.",
      country: "Austria",
    },
    {
      author: "Kiwi Coder",
      link: "https://example.com/nz",
      content:
        "Kia ora from Aotearoa. Minimal and clear—like the Southern Alps.",
      country: "New Zealand",
    },
    {
      author: "South Sudanese Voice",
      link: "https://example.com/southsudan",
      content: "From Juba to your guestbook—connection feels good.",
      country: "South Sudan",
    },
    {
      author: "Israeli Wanderer",
      link: "https://example.com/israel",
      content: "Shalom from Tel Aviv. This site flows like hummus and pita.",
      country: "Israel",
    },
    {
      author: "Czech Visitor",
      link: "https://example.com/czech",
      content: "From Prague’s quiet corners to your digital one—cheers.",
      country: "Czech Republic",
    },
    {
      author: "Finnish Observer",
      link: "https://example.com/finland",
      content: "Calm, focused, refined. Your guestbook is a Lapland breeze.",
      country: "Finland",
    },
    {
      author: "Iraqi Reader",
      link: "https://example.com/iraq",
      content: "Peace from Baghdad. You've built something thoughtful here.",
      country: "Iraq",
    },
    {
      author: "Slovak Guest",
      link: "https://example.com/slovakia",
      content: "Simple. Clear. Good work from Bratislava.",
      country: "Slovakia",
    },
    {
      author: "Romanian Coder",
      link: "https://example.com/romania",
      content: "Salutări din România. Compact and smooth—nice touch.",
      country: "Romania",
    },
    {
      author: "Lebanese Wanderer",
      link: "https://example.com/lebanon",
      content: "From the Cedars to the code—this place has soul.",
      country: "Lebanon",
    },
    {
      author: "Sri Lankan Mind",
      link: "https://example.com/srilanka",
      content: "Your site feels like a walk near Sigiriya at dawn. Peaceful.",
      country: "Sri Lanka",
    },
    {
      author: "Nepali Visitor",
      link: "https://example.com/nepal",
      content: "From Kathmandu with respect. This guestbook has good spirit.",
      country: "Nepal",
    },
    {
      author: "Jordanian Friend",
      link: "https://example.com/jordan",
      content: "Greetings from Amman. Simple things done well—like mansaf.",
      country: "Jordan",
    },
    {
      author: "Zimbabwean Guest",
      link: "https://example.com/zimbabwe",
      content: "From the lands of Vic Falls—your site speaks quietly but well.",
      country: "Zimbabwe",
    },
    {
      author: "Palestinian Visitor",
      link: "https://example.com/palestine",
      content:
        "From Ramallah to your world—thanks for making a space worth pausing in.",
      country: "Palestine",
    },
  ]);
}
