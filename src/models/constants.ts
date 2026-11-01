import { EventState } from "./event-state";

export const Constants = {
  colors: ["bg-blue", "bg-green", "bg-pink", "bg-orange", "bg-purple"],
  badParameterPattern: /^BAD_PARAM_[A-Z]+_[A-Za-z0-9]+$/, // Pattern for the standardized error messages sent from the server
  newsStatuses: {
		[EventState.All]: { color: 'bg-orange', label: 'all' },
		[EventState.OnHold]: { color: 'bg-yellow', label: 'on-hold' },
		[EventState.Published]: { color: 'bg-purple', label: 'published' },
		[EventState.Approved]: { color: 'bg-green', label: 'approved' },
		[EventState.Draft]: { color: 'bg-blue', label: 'draft' },
		[EventState.Deleted]: { color: 'bg-error', label: 'deleted' },
		[EventState.Denied]: { color: 'bg-pink', label: 'refused' },
	},
};
