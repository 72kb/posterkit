import PhotoBackdrop from './PhotoBackdrop'

/** Stacked photo block used by the standard editorial portrait layout. */
export default function PhotoArea({ height }) {
  return <PhotoBackdrop height={height || '72%'} />
}
