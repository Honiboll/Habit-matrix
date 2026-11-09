const now = new Date();

// Current day of month (e.g. 9 for November 9th)
export const CURRENT_DAY = now.getDate();

// Number of days in the current month (e.g. 30 for Nov, 31 for Dec)
export const DAYS_IN_MONTH = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

export const DAY_LETTERS = ["S", "M", "T", "W", "T", "F", "S"];

// Default habits are completely empty
export const DEFAULT_HABITS = [];

// Clean storage key
export const STORAGE_KEY = "habit_matrix_user_data_v3";
export const THEME_KEY = "habit_matrix_theme";
