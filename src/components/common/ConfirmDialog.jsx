import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'

export function ConfirmDialog({ open, title, description, confirmLabel = 'Confirm', tone = 'danger', loading, onConfirm, onClose }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button variant={tone === 'danger' ? 'danger' : 'primary'} onClick={onConfirm} disabled={loading}>
            {loading ? 'Working…' : confirmLabel}
          </Button>
        </>
      }
    />
  )
}
