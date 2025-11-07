import { memo } from "react";
import { ROLES } from "../utils/userRoles";

export const RoleSelector = memo(({ selectedRole, onRoleSelect }) => {
  const handleRoleSelection = (role) => {
    if (selectedRole !== role) {
      onRoleSelect(role);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        I want to use Homestead as a:
      </h3>
      <div className="grid grid-cols-1 gap-4">
        <button
          type="button"
          onClick={() => handleRoleSelection(ROLES.BUYER)}
          className={`p-4 border rounded-lg text-left transition-all ${
            selectedRole === ROLES.BUYER
              ? "border-primary bg-primary/5 ring-2 ring-primary/20"
              : "border-gray-200 hover:border-primary/30"
          }`}
        >
          <div className="font-medium text-gray-900">Home Buyer</div>
          <p className="text-sm text-gray-500 mt-1">
            I want to browse and purchase properties
          </p>
        </button>

        <button
          type="button"
          onClick={() => handleRoleSelection(ROLES.AGENT)}
          className={`p-4 border rounded-lg text-left transition-all ${
            selectedRole === ROLES.AGENT
              ? "border-primary bg-primary/5 ring-2 ring-primary/20"
              : "border-gray-200 hover:border-primary/30"
          }`}
        >
          <div className="font-medium text-gray-900">Property Agent/Owner</div>
          <p className="text-sm text-gray-500 mt-1">
            I want to list and sell properties
          </p>
        </button>
      </div>
    </div>
  );
});

RoleSelector.displayName = "RoleSelector";

export default RoleSelector;
