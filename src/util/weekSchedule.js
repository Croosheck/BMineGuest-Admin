export const WEEK_SCHEDULE = [
	{
		day: 1,
		dayLong: "monday",
		hours: {
			reservationsClose: 20,
			reservationsOpen: 13,
		},
		isOpen: true,
	},
	{
		day: 2,
		dayLong: "tuesday",
		hours: {
			reservationsClose: 20,
			reservationsOpen: 13,
		},
		isOpen: false,
	},
	{
		day: 3,
		dayLong: "wednesday",
		hours: {
			reservationsClose: 20,
			reservationsOpen: 13,
		},
		isOpen: false,
	},
	{
		day: 4,
		dayLong: "thursday",
		hours: {
			reservationsClose: 20,
			reservationsOpen: 12,
		},
		isOpen: true,
	},
	{
		day: 5,
		dayLong: "friday",
		hours: {
			reservationsClose: 20,
			reservationsOpen: 11,
		},
		isOpen: true,
	},
	{
		day: 6,
		dayLong: "saturday",
		hours: {
			reservationsClose: 20,
			reservationsOpen: 11,
		},
		isOpen: true,
	},
	{
		day: 0,
		dayLong: "sunday",
		hours: {
			reservationsClose: 20,
			reservationsOpen: 13,
		},
		isOpen: false,
	},
];

export function weekScheduleDay(day) {
	const dayForm = {
		day: day.day,
		dayLong: day.dayLong,
		hours: day.hours
			? {
					reservationsClose: day.hours.reservationsClose,
					reservationsOpen: day.hours.reservationsOpen,
			  }
			: {
					reservationsClose: 12,
					reservationsOpen: 20,
			  },
		isOpen: day.isOpen,
	};

	return dayForm;
}
