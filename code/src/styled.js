import {createGlobalStyle} from 'styled-components';

export const DMode = createGlobalStyle`
  body{
    background-color: ${props => props.dmode === true ? '#111111' : '#fff'};
  }
  header{
    background-color: ${props => props.dmode === true ? '#4672FE' : '#f5f5f5'};
    border-bottom: ${props => props.dmode === true ? '#351C75' : 'rgb(219,219,219)'} 1px solid;
  }
`;