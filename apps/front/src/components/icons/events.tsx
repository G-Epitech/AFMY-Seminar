enum ArrowDirection {
  Up = "up",
  Down = "down",
  Right = "right",
  Left = "left"
}

export const arrowIcons: { [key in ArrowDirection]: () => JSX.Element } = {
  "up": () => <i className="fa-solid fa-arrow-up" />,
  "down": () => <i className="fa-solid fa-arrow-down" />,
  "right": () => <i className="fa-solid fa-arrow-right" />,
  "left": () => <i className="fa-solid fa-arrow-left" />,
};
