import { FC, memo } from 'react';
import { useBoardConfig } from '../hooks/useBoardConfig';
import useFetch from '../hooks/useFetch';
import Modal from './Modal';
import { Spinner } from './Spinner';

type RulesProps = {
  onClose: () => void;
  visible: boolean;
  seasonId: string;
};

const setOnOff = (state: boolean | number): string => (state ? 'On' : 'Off');

export const Rules: FC<RulesProps> = memo((props) => {
  const { visible, seasonId, onClose } = props;
  const seasonRules = useBoardConfig(seasonId);
  const { response: seasonInfo } = useFetch(`api/seasons/${seasonId}`, '0');
  if (!seasonRules) return <Spinner />;
  const gridSize = `${seasonRules.width} x ${seasonRules.height}`;

  return visible ? (
    <Modal onClose={onClose}>
      <div>
        <h1 className="text-xl 3xl:text-2xl mb-3">Season rules</h1>

        {seasonRules ? (
          <>
            <RuleItem label="Grid size" value={gridSize} />
            <RuleItem
              label="Delay between moves"
              value={seasonRules.minimumDelayBetweenMoves}
            />
            <RuleItem label="Round length" value={seasonRules.sessionLength} />
            <RuleItem
              label="Inventory size"
              value={seasonRules.inventorySize}
            />
            <RuleItem
              label="Tackling"
              value={setOnOff(seasonRules.canTackle)}
            />
            <RuleItem
              label="Teleporters"
              value={setOnOff(seasonRules.teleporters)}
            />
            <RuleItem
              label="Number of teleporters"
              value={seasonRules.teleporters}
            />
            <RuleItem
              label="Teleporter relocation time"
              value={seasonRules.teleportRelocation}
            />
            {seasonInfo && (
              <RuleItem
                label="Season Ends"
                value={new Date(seasonInfo.endDate).toLocaleDateString(
                  'en-US',
                  {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  },
                )}
              />
            )}
          </>
        ) : (
          <p>No rules found for the selected season</p>
        )}
      </div>
      <button className="modal-button" onClick={() => onClose()}>
        x
      </button>
    </Modal>
  ) : null;
});

Rules.displayName = 'Rules';

type RuleItemProps = {
  label: string;
  value: string | number;
};

const RuleItem: FC<RuleItemProps> = ({ label, value }) => (
  <>
    <label className="text-label mb-0">{label}</label>
    <p className="mt-0 mb-2">{value}</p>
  </>
);
