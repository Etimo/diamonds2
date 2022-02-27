import Rules from "../blocks/Rules";
import useBoardConfig from "../hooks/useBoardConfig";
import { close } from "../images";

const RulesModal = ({ visible, setRulesVisible, seasonId }) => {
  let rules = useBoardConfig(seasonId);
  const style = {
    position: "relative"
  };

  return (
    visible && (
      <Rules>
        <div style={style}>
          <Rules.Title>Season Rules</Rules.Title>
          {rules ? (
            <div>
              <Rules.RuleWrapper>
                <Rules.Label>Grid Size</Rules.Label>
                <Rules.Value>{`${rules.width} x ${rules.height}`}</Rules.Value>
              </Rules.RuleWrapper>
              <Rules.RuleWrapper>
                <Rules.Label>Delay between moves</Rules.Label>
                <Rules.Value>≥ {rules.minimumDelayBetweenMoves}ms</Rules.Value>
              </Rules.RuleWrapper>
              <Rules.RuleWrapper>
                <Rules.Label>Round length</Rules.Label>
                <Rules.Value>{rules.sessionLength}</Rules.Value>
              </Rules.RuleWrapper>
              <Rules.RuleWrapper>
                <Rules.Label>Inventory size</Rules.Label>
                <Rules.Value>{rules.inventorySize}</Rules.Value>
              </Rules.RuleWrapper>
              <Rules.RuleWrapper>
                <Rules.Label>Tackling</Rules.Label>
                <Rules.Value>{rules.canTackle ? "On" : "Off"}</Rules.Value>
              </Rules.RuleWrapper>
              <Rules.RuleWrapper>
                <Rules.Label>Teleporters</Rules.Label>
                <Rules.Value>
                  {rules.teleporters > 0 ? "On" : "Off"}
                </Rules.Value>
              </Rules.RuleWrapper>
              <Rules.RuleWrapper>
                <Rules.Label>Number of teleporters</Rules.Label>
                <Rules.Value>{rules.teleporters}</Rules.Value>
              </Rules.RuleWrapper>
              <Rules.RuleWrapper>
                <Rules.Label>Teleporter relocation time</Rules.Label>
                <Rules.Value>{rules.teleportRelocation}s</Rules.Value>
              </Rules.RuleWrapper>
            </div>
          ) : (
            <Rules.RuleWrapper>
              <Rules.Value>Found no rules for the selected season</Rules.Value>
            </Rules.RuleWrapper>
          )}
          <Rules.Close
            alt="close"
            src={close}
            onClick={() => setRulesVisible(false)}
          />
        </div>
      </Rules>
    )
  );
};

export default RulesModal;
