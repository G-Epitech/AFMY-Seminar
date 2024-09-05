export const paymentIcons: { [key: string]: () => JSX.Element } = {
  "Paypal": () => <i className="fa-brands fa-paypal fa-lg" title="Paypal" />,
  "Credit Card": () => <i className="fa-brands fa-cc-visa fa-lg" title="Credit Card" />,
  "Bank Transfer": () => <i className="fa-solid fa-building-columns fa-lg" title="Bank Transfer" />,
};
