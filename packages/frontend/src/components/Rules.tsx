import { FC, memo } from 'react';
import { useBoardConfig } from '../hooks/useBoardConfig';
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
  if (!seasonRules) return <Spinner />;
  const gridSize = `${seasonRules.width} x ${seasonRules.height}`;

  return visible ? (
    <Modal onClose={onClose}>
      <div>
        <h1 className="text-xl 3xl:text-2xl mb-3">Season rules</h1>

        {seasonRules ? (
          <>
            <label className="text-label mb-0">Grid size</label>
            <p className="mt-0 mb-2">{gridSize}</p>
            <label className="text-label mb-0">Delay between moves</label>
            <p className="mt-0 mb-2">{seasonRules.minimumDelayBetweenMoves}</p>
            <label className="text-label mb-0">Round length</label>
            <p className="mt-0 mb-2">{seasonRules.sessionLength}</p>
            <label className="text-label mb-0">Inventory size</label>
            <p className="mt-0 mb-2">{seasonRules.inventorySize}</p>
            <label className="text-label mb-0">Tackling</label>
            <p className="mt-0 mb-2">{setOnOff(seasonRules.canTackle)}</p>
            <label className="text-label mb-0">Teleporters</label>
            <p className="mt-0 mb-2">{setOnOff(seasonRules.teleporters)}</p>
            <label className="text-label mb-0">Number of teleporters</label>
            <p className="mt-0 mb-2">{seasonRules.teleporters}</p>
            <label className="text-label mb-0">
              Teleporter relocation time
            </label>
            <p className="mt-0 mb-2">{seasonRules.teleportRelocation}</p>
          </>
        ) : (
          <p>No rules found for the selected season</p>
        )}
      </div>
      <button className="modal-button" onClick={() => onClose()}>
        x
      </button>
    </Modal>
  ) : (
    <></>
  );
});

Rules.displayName = 'Rules';
