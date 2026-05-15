// Device catalog: deviceType -> brand -> [models]
// Used for cascading dropdowns in QR Scanner and Submit Device forms

export const deviceCatalog = {
  Smartphone: {
    Samsung: [
      'Galaxy S26 Ultra', 'Galaxy S26+', 'Galaxy S26',
      'Galaxy S25 Ultra', 'Galaxy S25+', 'Galaxy S25',
      'Galaxy Z Fold7', 'Galaxy Z Flip7', 'Galaxy S24 FE',
      'Galaxy A57 5G', 'Galaxy A56 5G', 'Galaxy A37 5G', 'Galaxy A36 5G',
      'Galaxy A18 5G', 'Galaxy A17 5G',
      'Galaxy M57 5G', 'Galaxy M37 5G', 'Galaxy M36 5G', 'Galaxy M17e 5G',
    ],
    OnePlus: [
      'OnePlus 16', 'OnePlus 15T', 'OnePlus 15', 'OnePlus 15R',
      'OnePlus 13', 'OnePlus 13R',
      'OnePlus Nord 6', 'OnePlus Nord CE 6 5G', 'OnePlus Nord CE 5',
    ],
    Xiaomi: [
      'Xiaomi 17 Ultra', 'Xiaomi 14T Pro',
      'Redmi Note 15 Pro', 'Redmi Note 15 SE',
      'Redmi Note 14 Pro 5G', 'Redmi Turbo 4 Pro',
      'Redmi K90 Max', 'Redmi A7 Pro 5G', 'Redmi A4 5G',
      'POCO X8 Pro Max', 'POCO F7 Pro', 'POCO M8 Pro', 'POCO M8 5G',
    ],
    Vivo: [
      'Vivo X300 Ultra', 'Vivo X300 Pro', 'Vivo X300 FE', 'Vivo X300s',
      'Vivo V70 FE',
      'Vivo T5 Pro 5G', 'Vivo T5 Ultra', 'Vivo T5 5G', 'Vivo T5 Lite 5G',
      'Vivo T4 Pro 5G',
      'Vivo Y500 Pro', 'Vivo Y500', 'Vivo Y60m 5G', 'Vivo Y31d',
      'iQOO 15 Apex', 'iQOO 15R', 'iQOO Neo 11', 'iQOO Neo 6 5G',
      'iQOO Z11 Turbo', 'iQOO Z11', 'iQOO Z10x',
    ],
    Apple: [
      'iPhone 17 Pro Max', 'iPhone 17 Pro', 'iPhone 17 Plus', 'iPhone 17',
      'iPhone Fold', 'iPhone 16 Plus', 'iPhone SE 2024',
    ],
    Motorola: [
      'Motorola Signature',
      'Edge 70 Pro', 'Edge 70 Fusion', 'Edge 60 Pro', 'Edge 60 Fusion', 'Edge 60 Stylus',
      'Edge 40 Pro',
      'G86 Power', 'G57 Power', 'G96 5G', 'G67',
    ],
    OPPO: [
      'Find X9 Ultra', 'Find X9 Pro', 'Find X9s', 'Find X7 Pro Ultra',
      'F33 Pro 5G', 'F33 5G', 'Reno 15',
      'K15 Pro Plus', 'K15 Pro', 'K14 5G', 'K12s', 'A6s Pro',
    ],
    Realme: [
      'GT 8', 'GT 7', 'Realme 16',
      'C100 4G', 'C100X',
      'Narzo 100 Lite 5G', 'Narzo 80 Pro 5G', 'P4 Power',
    ],
    Nothing: [
      'Nothing Phone (3)', 'Nothing Phone (3a) Lite',
      'CMF Phone 3 Pro', 'CMF Phone 1',
    ],
    Google: [
      'Pixel 11 Pro Fold', 'Pixel 11 Pro', 'Pixel 11', 'Pixel 9A',
    ],
    Infinix: [
      'Infinix Note 60 Ultra', 'Infinix Note 60 Pro 5G',
      'Tecno Camon 50', 'Tecno Camon 40 Pro 5G', 'Tecno Spark 50 4G',
    ],
    Others: [
      'Lava Storm Lite 5G', 'Lava Bold 2 5G', 'Lava Blaze Curve',
      'Itel A100',
      'Ai+ Nova 2 Ultra 5G', 'Ai+ Nova 2 5G', 'Ai+ PulseTab',
      'Nubia Neo 5 GT', 'Honor GT Pro',
    ],
  },

  Laptop: {
    Dell: ['Inspiron 15', 'Inspiron 14', 'XPS 13', 'XPS 15', 'Latitude 5420', 'Latitude 7400'],
    HP: ['Pavilion 15', 'Pavilion x360', 'Envy 13', 'Envy x360', 'Omen 16'],
    Lenovo: ['ThinkPad X1', 'ThinkPad T14', 'IdeaPad 3', 'IdeaPad Slim 5', 'Legion 5'],
    Apple: ['MacBook Air M1', 'MacBook Air M2', 'MacBook Pro M1', 'MacBook Pro M2'],
    Asus: ['ROG Strix', 'ROG Zephyrus', 'VivoBook 15', 'ZenBook 14'],
    Acer: ['Aspire 5', 'Nitro 5', 'Predator Helios'],
  },

  Tablet: {
    Apple: ['iPad 10th Gen', 'iPad 9th Gen', 'iPad Air', 'iPad Pro'],
    Samsung: ['Galaxy Tab S9', 'Galaxy Tab S8', 'Galaxy Tab A7'],
    Lenovo: ['Tab P11', 'Tab M10'],
    Xiaomi: ['Pad 6', 'Pad 5'],
  },

  TV: {
    Samsung: ['Crystal UHD', 'Neo QLED', 'QLED 4K'],
    LG: ['OLED C1', 'OLED C2', 'NanoCell'],
    Sony: ['Bravia XR', 'Bravia X80'],
    Mi: ['Mi TV 5X', 'Redmi Smart TV'],
    OnePlus: ['OnePlus TV Y Series', 'Q Series'],
  },
};

// Types that require IMEI
export const IMEI_REQUIRED_TYPES = ['Smartphone', 'Tablet'];

// Points formula by condition
export const calculatePoints = (condition) => {
  switch (condition) {
    case 'working':     return { ecoPoints: 50,  estimatedValue: 100 };
    case 'needs_repair': return { ecoPoints: 70, estimatedValue: 40 };
    case 'broken':      return { ecoPoints: 100, estimatedValue: 10 };
    default:            return { ecoPoints: 30,  estimatedValue: 5 };
  }
};
