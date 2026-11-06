# UOCO AGRO FARM Store

A premium, responsive e-commerce storefront for UOCO Agro Farm, built with HTML5, CSS3, and vanilla JavaScript.

## Run locally

Option 1: Open `index.html` directly in a browser.

Option 2: Serve the folder locally:

```bash
cd "C:\Users\aloed\Documents\UOCO Ording\uoco-agro-store"
py -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## Update contact details

Edit the `business` object in `script.js`:

```js
const business = {
  name: 'UOCO AGRO FARM',
  tagline: 'LET MY PEOPLE EAT.',
  location: 'Ethiope West, Oghara, Delta State, Nigeria.',
  email: 'uocofarmingproject@gamil.com',
  instagram: '@uocofarming',
  whatsappNumbers: ['+447848866648', '+2349127475250'],
};
```

## Replace images and logo

- Replace `assets/logo.jpg` with your updated company logo file.
- Replace `assets/tomatoes.jpg` with a fresh tomato image.
- Replace `assets/habanero-peppers.jpg` with a habanero pepper image.
- Replace `assets/farm.jpg` with a farm or field photo.

Use the same file names to keep the site working without code changes.

## Notes

- The cart is saved in `localStorage`.
- Checkout opens a WhatsApp order message instead of using a fake payment system.
- The website includes responsive mobile navigation, product cart controls, and validation before sending the order.
