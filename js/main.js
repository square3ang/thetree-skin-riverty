window.defaultConfig = {
    ...window.defaultConfig,
    'liberty.fixed_navbar': false,
    'liberty.reset_search_on_move': true,
    'liberty.rev_selector': true,
    'liberty.rev_convenience': true,
    'liberty.admin_convenience': true
}

function darkenColor(hex, percent=50) {
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);

    r = Math.round(r * (1 - percent / 100));
    g = Math.round(g * (1 - percent / 100));
    b = Math.round(b * (1 - percent / 100));

    return "#" + ((r < 16 ? "0" : "") + r.toString(16)) + ((g < 16 ? "0" : "") + g.toString(16)) + ((b < 16 ? "0" : "") + b.toString(16));
}

function lightenColor(hex, percent=50) {
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);

    r = Math.round(r + (255 - r) * (percent / 100));
    g = Math.round(g + (255 - g) * (percent / 100));
    b = Math.round(b + (255 - b) * (percent / 100));

    return "#" + ((r < 16 ? "0" : "") + r.toString(16)) + ((g < 16 ? "0" : "") + g.toString(16)) + ((b < 16 ? "0" : "") + b.toString(16));
}

function selectByTheme(light, dark) {
    return localConfig['wiki.theme'] === 'dark' ? dark : light;
}

const brand_color = () => selectByTheme(CONFIG['theme_color'] ?? '#4188f1', '#2d2f34');

const style = document.createElement('style');
function setStyles() {
    const styles = {
        '--liberty-brand-color': brand_color(),
        '--liberty-brand-dark-color': selectByTheme(CONFIG['skin.liberty.brand_dark_color_1'] ?? darkenColor(brand_color()), '#16171a'),
        '--liberty-brand-bright-color': selectByTheme(CONFIG['skin.liberty.brand_bright_color_1'] ?? lightenColor(brand_color()), '#383b40'),
        '--liberty-navbar-logo-image': CONFIG['logo_image'] && `url(${CONFIG['logo_image']})`,
        '--liberty-navbar-logo-minimum-width': CONFIG['skin.liberty.navbar_logo_minimum_width'],
        '--liberty-navbar-logo-width': CONFIG['skin.liberty.navbar_logo_width'],
        '--liberty-navbar-logo-size': CONFIG['skin.liberty.navbar_logo_size'],
        '--liberty-navbar-logo-padding': CONFIG['skin.liberty.navbar_logo_padding'],
        '--liberty-navbar-logo-margin': CONFIG['skin.liberty.navbar_logo_margin'],
        '--brand-color-1': 'var(--liberty-brand-color)',
        '--brand-color-2': selectByTheme(CONFIG['skin.liberty.brand_color_2'] ?? 'var(--liberty-brand-color)', 'var(--liberty-brand-color)'),
        '--brand-bright-color-1': 'var(--liberty-brand-bright-color)',
        '--brand-bright-color-2': selectByTheme(CONFIG['skin.liberty.brand_bright_color_2'] ?? 'var(--liberty-brand-bright-color)', 'var(--liberty-brand-bright-color)'),
        '--text-color': selectByTheme('#373a3c', '#ddd'),
        '--article-background-color': selectByTheme('#fff', '#000')
    }

    style.textContent = `.Liberty {${Object.keys(styles).filter(a => styles[a]).map(a => `${a}:${styles[a]};`).join('')}}`;
    document.head.appendChild(style);
}
setStyles();

function openSettingModal() {
    console.log('TODO: config');
}

document.addEventListener('alpine:init', () => {
    Alpine.store('skin', {
        isShowEditMessage: false,
        showEditMessage() {
            console.log('showEditMessage');
            if (this.isShowACLMessage) {
                movePage(doc_action_link(page.data.document, requestable ? 'new_edit_request' : 'edit'));
            }
            else {
                this.isShowACLMessage = true;
            }
        },
        hideEditMessage() {
            this.isShowACLMessage = false;
        },
        onPageMove() {
            // TODO: set isShowACLMessage to false on page move
            // this.isShowACLMessage = false;
        }
    });

    Alpine.data('fromSelector', () => ({
        until: !!query.get('until'),
        revInput: (query.get('from') || query.get('until')) ?? '',
        revSearch() {
            if(!this.revInput) pjax.loadUrl(doc_action_link(page.data.document, 'history'));
            else pjax.loadUrl(doc_action_link(page.data.document, 'history', this.until ? { until: this.revInput } : { from: this.revInput }));
        },
        onPageMove() {
            // TODO: set rev input on page move
            // this.until = !!this.$route.query.until;
            // this.revInput = (this.$route.query.from || this.$route.query.until) ?? '';
        }
    }));
});

// TODO: reset search on page move, subrepo commit test
// if (this.$store.state.localConfig["liberty.reset_search_on_move"] !== false) this.reset();