### Tailwind Config

ALL NEW COLORS, TYPOGRAPHY, SPACING, ETC SHOULD BE ADDED to
[styles.css](./styles.css)!!!

You can then define these classes in the `base.ts` file.

Going forward, you may not arbitrarily add colors to your components. You must add them to the `styles.css` file and then use them in your components. This is to enforce brand consistency and to ensure that we are not creating a rainbow of colors in our components.

## Where should I apply styles?

Is this a primitive style change? Update the shadcn component in `@good-dog/ui`
Is this a component style change? Update the individual component in `@good-dog/components`
Is this a 1-of-a-kind style change? In-line the class wherever needed
