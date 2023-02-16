import styled from "styled-components";
import Title from "./Title";
import Picker from "./Picker";
import HoverText from "./HoverText";
import PickerWrapper from "./PickerWrapper";

const Select = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
`;

Select.Title = Title;
Select.Picker = Picker;
Select.PickerWrapper = PickerWrapper;
Select.HoverText = HoverText;

export default Select;
