class Decoration {
    constructor() {
        this.isDirty = false;
    }

    set dirty(bool) {
        this.isDirty = bool;
    }
    get dirty() {
        return this.isDirty;
    }

    render() {
        if (this.isDirty) {
            throw new Error("Dirty decorations cannot be rendered.");
        }
    }
}