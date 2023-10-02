import { diamond } from './images';

export const Spinner = () => {
  const numberOfDiamonds = 4;

  const diamondElements = Array.from(
    { length: numberOfDiamonds },
    (_, index) => (
      <div key={index}>
        <img src={diamond} alt={'diamond'} />
      </div>
    ),
  );

  return <div className="lds-ellipsis">{diamondElements}</div>;
};
