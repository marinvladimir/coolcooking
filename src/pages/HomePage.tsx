import React from 'react';
import styled from 'styled-components';

const Content = styled.main`
  flex: 1;
  padding: 5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
    color: ${(props) => props.theme.colors.accent};
  }

  p {
    font-size: 1.2rem;
    line-height: 1.8;
    max-width: 800px;
    margin-bottom: 2rem;
  }
`;

const HomePage: React.FC = () => {
  function flattenArray(arr: any[]) {
    return arr.reduce((acc, val) => 
        Array.isArray(val) ? acc.concat(flattenArray(val)) : acc.concat(val), []);
}

console.log(flattenArray([1, [2, [3, [4, [5]]]]])); // [1, 2, 3, 4, 5]

  return (
    <Content>
      <h1>Welcome to Cooking Recipes</h1>
      <p>
        Discover a variety of delicious recipes to satisfy your taste buds. From
        hearty soups to sweet desserts, explore our collection and unleash your
        inner chef.
      </p>
    </Content>
  );
};

export default HomePage;
