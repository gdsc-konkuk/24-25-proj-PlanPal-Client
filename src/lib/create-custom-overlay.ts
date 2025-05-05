export function createCustomOverlay(
  googleMaps: typeof google.maps,
  position: google.maps.LatLng,
  container: HTMLElement,
  onClose: () => void
) {
  class CustomOverlay extends googleMaps.OverlayView {
    constructor(
      public position: google.maps.LatLng,
      public content: HTMLElement,
      public onClose: () => void
    ) {
      super();
    }

    onAdd() {
      const panes = this.getPanes();
      panes?.floatPane.appendChild(this.content);
    }

    draw() {
      const projection = this.getProjection();
      const point = projection?.fromLatLngToDivPixel(this.position);
      if (point) {
        this.content.style.left = `${point.x}px`;
        this.content.style.top = `${point.y}px`;
        this.content.style.position = "absolute";
        this.content.style.transform = "translate(-50%, -100%)";
      }
    }

    onRemove() {
      this.content.remove();
      this.onClose();
    }
  }

  return new CustomOverlay(position, container, onClose);
}
