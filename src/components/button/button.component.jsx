/*
3 types of button we have 
1.default
2.inverted
3.google sign in 
So how to laverage this button type in order to show styling for three different kinds of buttons?
*/
import {
  BaseButton,
  GoogleSignInButton,
  InvertedButton,
} from "./button.component.styles";

export const BUTTON_TYPE_CLASSES = {
  base: "base",
  google: "google-sign-in",
  inverted: "inverted",
};

const getButton = (buttonType = BUTTON_TYPE_CLASSES.base) =>
  ({
    [BUTTON_TYPE_CLASSES.base]: BaseButton,
    [BUTTON_TYPE_CLASSES.google]: GoogleSignInButton,
    [BUTTON_TYPE_CLASSES.inverted]: InvertedButton,
  }[buttonType]);

const CustomButton = ({ children, buttonType, ...otherProps }) => {
  const CustomizedButtom = getButton(buttonType);
  return <CustomizedButtom {...otherProps}>{children}</CustomizedButtom>;
};

export default CustomButton;
