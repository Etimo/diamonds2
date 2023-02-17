import React, { FC, memo } from 'react';

type RulesProps = {
  onClose: () => void;
  visible: boolean;
  seasonId: number;
};

export const Rules: FC<RulesProps> = memo((props) => {
  const { visible, seasonId, onClose } = props;
  const rules = true;

  return visible ? (
    <div className="modal-wrapper">
      <div className="relative">
        <h1 className="text-xl mb-3">Season rules</h1>

        {rules ? (
          <>
            <label className="text-label mb-0">Grid size</label>
            <p className="mt-0 mb-2">Value</p>
            <label className="text-label mb-0">Delay between moves</label>
            <p className="mt-0 mb-2">Value</p>
            <label className="text-label mb-0">Round length</label>
            <p className="mt-0 mb-2">Value</p>
            <label className="text-label mb-0">Inventory size</label>
            <p className="mt-0 mb-2">Value</p>
            <label className="text-label mb-0">Tackling</label>
            <p className="mt-0 mb-2">Value</p>
            <label className="text-label mb-0">Teleporters</label>
            <p className="mt-0 mb-2">Value</p>
            <label className="text-label mb-0">Number of teleporters</label>
            <p className="mt-0 mb-2">Value</p>
            <label className="text-label mb-0">
              Teleporter relocation time
            </label>
            <p className="mt-0 mb-2">Value</p>
          </>
        ) : (
          <p>No rules found for the selected season</p>
        )}
      </div>

      <button className="modal-button" onClick={() => onClose()}>
        x
      </button>
    </div>
  ) : (
    <></>
  );
});

Rules.displayName = 'Rules';
