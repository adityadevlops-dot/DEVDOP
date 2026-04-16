/* ── BACKEND INTEGRATION POINTS ──
   - Listen for cursor:move events: socket.on('cursor:move')
   - Emit cursor position: socket.emit('cursor:move', { line, column })
   - Current status: UI structure only, no sync
*/

export const CursorOverlay = () => {
  // TODO: Integrate with editor to show remote cursors
  // This should render colored decorations in Monaco editor for each remote user's cursor
  return null
}
