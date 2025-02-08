import React from "react";
import { FaExchangeAlt } from "react-icons/fa";
import { getRoleDisplay } from "../utils/userRoles";

const RoleToggleButton = ({ currentRole, availableRoles, onRoleSwitch }) => {
  if (availableRoles?.length <= 1) return null;

  const nextRole =
    availableRoles.find((role) => role !== currentRole) || currentRole;

  return (
    <button
      onClick={() => onRoleSwitch(nextRole)}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-secondary/10 transition-all group"
      title={`Switch to ${getRoleDisplay(nextRole)} view`}
    >
      <span className="text-sm font-medium">{getRoleDisplay(currentRole)}</span>
      <FaExchangeAlt className="text-xs opacity-50 group-hover:rotate-180 transition-all duration-300" />
    </button>
  );
};

export default React.memo(RoleToggleButton);
