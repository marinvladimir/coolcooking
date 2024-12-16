export const themes: Record<
  RecipeCategory,
  {
    colors: {
      primary: string;
      secondary: string;
      background: string;
      lightBackground: string;
      accent: string;
      headerImage: string;
      text: string;
      border: string;
      disabled: string;
      disabledText: string;
    };
  }
> = {
  soups: {
    colors: {
      primary: '#ffcc00',
      secondary: '#ff9900',
      background: '#fff8e1',
      lightBackground: '#fff3c1',
      accent: '#ff6600',
      headerImage: '/assets/soup.png',
      text: '#6b4226',
      border: '#ff6600',
      disabled: '#ffe6b3',
      disabledText: '#a65400',
    },
  },
  desserts: {
    colors: {
      primary: '#ff99cc',
      secondary: '#ff6699',
      background: '#ffe4f1',
      lightBackground: '#ffe1f3',
      accent: '#cc3366',
      headerImage: '/assets/desserts.png',
      text: '#6b4226',
      border: '#cc3366',
      disabled: '#ffeaf4',
      disabledText: '#993355',
    },
  },
  salads: {
    colors: {
      primary: '#66cc33',
      secondary: '#009900',
      background: '#f1ffe4',
      lightBackground: '#e1ffc1',
      accent: '#ff7043',
      headerImage: '/assets/salads.png',
      text: '#2e8b57',
      border: '#ff7043',
      disabled: '#e6ffd9',
      disabledText: '#338c27',
    },
  },
  mainDishes: {
    colors: {
      primary: '#cc0000',
      secondary: '#990000',
      background: '#ffe4e4',
      lightBackground: '#ffcccc',
      accent: '#660000',
      headerImage: '/assets/mainMeal.png',
      text: '#8b3d3d',
      border: '#8b3d3d',
      disabled: '#ffd6d6',
      disabledText: '#992626',
    },
  },
  drinks: {
    colors: {
      primary: '#0099cc',
      secondary: '#006699',
      background: '#e1f4ff',
      lightBackground: '#c1e9ff',
      accent: '#004466',
      headerImage: '/assets/drinks.png',
      text: '#004d73',
      border: '#004466',
      disabled: '#d8f0ff',
      disabledText: '#336073',
    },
  },
};
