// /src/shared/utils/getAvatar.ts

/**
 * Returns the avatar URL for a user.
 * If avatar is missing or empty, fallback to Dicebear with user id as seed.
 */
export function getAvatar(user?: { avatar?: string; _id?: string }): string {
  if (user?.avatar && user.avatar.trim() !== '') {
    return user.avatar;
  }
  // fallback to Dicebear (pixel-art), use "default" if no id
  return `https://api.dicebear.com/8.x/pixel-art/svg?seed=${user?._id || 'default'}`;
}
