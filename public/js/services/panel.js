app
    .controller('PanelCtrl', PanelCtrl);

// Necessary to pass locals to the dialog template.
function PanelCtrl(mdPanelRef) {
    this._mdPanelRef = mdPanelRef;
}

PanelCtrl.prototype.closeDialog = function () {
    this._mdPanelRef && this._mdPanelRef.close();
};

app
    .factory('Panel', function ($mdPanel) {
        var _this = {
            _mdPanel: $mdPanel,
            openFrom: 'button',
            closeTo: 'button',
            animationType: 'none'
        };

        _this.showDialog = function () {
            var position = _this._mdPanel.newPanelPosition()
                .absolute()
                .right()
                .top();

            var animation = _this._mdPanel.newPanelAnimation();

            switch (this.openFrom) {
                case 'button':
                    animation.openFrom('.animation-target');
                    break;
                case 'corner':
                    animation.openFrom({ top: 0, left: 0 });
                    break;
                case 'bottom':
                    animation.openFrom({
                        top: document.documentElement.clientHeight,
                        left: document.documentElement.clientWidth / 2 - 250
                    });
            }
            switch (this.closeTo) {
                case 'button':
                    animation.closeTo('.animation-target');
                    break;
                case 'corner':
                    animation.closeTo({ top: 0, left: 0 });
                    break;
                case 'bottom':
                    animation.closeTo({
                        top: document.documentElement.clientHeight,
                        left: document.documentElement.clientWidth / 2 - 250
                    });
            }

            switch (this.animationType) {
                case 'custom':
                    animation.withAnimation({
                        open: 'dialog-custom-animation-open',
                        close: 'dialog-custom-animation-close'
                    });
                    break;
                case 'slide':
                    animation.withAnimation(_this._mdPanel.animation.SLIDE);
                    break;
                case 'scale':
                    animation.withAnimation(_this._mdPanel.animation.SCALE);
                    break;
                case 'fade':
                    animation.withAnimation(_this._mdPanel.animation.FADE);
                    break;
                case 'none':
                    animation = undefined;
                    break;
            }

            var dir = '/templates/';
            var config = {
                animation: animation,
                attachTo: angular.element(document.body),
                controller: PanelCtrl,
                controllerAs: 'ctrl',
                templateUrl: dir + 'panel/test.html?v=' + window.deviceCacheKey,
                panelClass: 'custom-panel',
                position: position,
                trapFocus: true,
                zIndex: 150,
                clickOutsideToClose: true,
                clickEscapeToClose: true,
                hasBackdrop: true,
            };

            _this._mdPanel.open(config);
        };
        return _this;
    });

