// Generate a name-initials avatar URL — works everywhere without any uploaded files
export function getAvatarUrl(name, size = 128) {
  const encoded = encodeURIComponent(name || 'User');
  return `https://ui-avatars.com/api/?name=${encoded}&background=3525cd&color=fff&size=${size}&bold=true&rounded=true`;
}
