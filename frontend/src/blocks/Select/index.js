import styled from "styled-components";
import Title from "./Title";
import Picker from "./Picker";

const Select = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
`;

Select.Title = Title;
Select.Picker = Picker;

export default Select;
