import { EventState } from "./event-state";

export const Constants = {
  colors: ["bg-blue", "bg-green", "bg-pink", "bg-orange", "bg-purple"],
  badParameterPattern: /^BAD_PARAM_[A-Z]+_[A-Za-z0-9]+$/, // Pattern for the standardized error messages sent from the server
  newsStatuses: {
		[EventState.All]: { color: 'bg-orange', label: 'all', value: EventState.All },
		[EventState.OnHold]: { color: 'bg-yellow', label: 'on-hold', value: EventState.OnHold },
		[EventState.Published]: { color: 'bg-purple', label: 'published', value: EventState.Published },
		[EventState.Approved]: { color: 'bg-green', label: 'approved', value: EventState.Approved },
		[EventState.Draft]: { color: 'bg-blue', label: 'draft', value: EventState.Draft },
		[EventState.Deleted]: { color: 'bg-error', label: 'deleted', value: EventState.Deleted },
		[EventState.Denied]: { color: 'bg-pink', label: 'refused', value: EventState.Denied },
	},
};
