import React, { View, Component} from 'react-native';
import { buildTabGraph } from './tab_graph';
import { Normalbar } from './bar';

const REF_BAR = 'REF_BAR';

//Tabbar
export default class Tabbar extends Component {
  constructor(props, context) {
    super(props, context);
    this.prevContentRef = null;
    this.prevtabRef = null;
    this.state = {
      tabs: buildTabGraph(props.children),
      activeTab: ''
    };
  }

  getChildContext() {
    return {
      barSize: this.props.barSize,
      //we need this to let the content register show and hide method
      registerTabContent: this.registerTabContent.bind(this),
      registerTabIcon: this.registerTabIcon.bind(this),
      gotoTab: this.gotoTab.bind(this),
      getBarRef: this.getBarRef.bind(this)
    };
  }

  registerTabContent(ref, tabName) {
    this.state.tabs.some((tab) => {
      if (tab.name !== tabName) {
        return false;
      }
      tab.contentRef = ref;
      return true;
    });
  }

  registerTabIcon(ref, tabName) {
    this.state.tabs.some((tab) => {
      if (tab.name !== tabName) {
        return false;
      }
      tab.tabRef = ref;
      return true;
    });
  }

  getBarRef() {
    return this.refs[REF_BAR];
  }

  gotoTab(tabName) {
    this.state.tabs.some((tab) => {
      if (tab.name !== tabName) {
        return false;
      }

      if (this.prevContentRef !== tab.contentRef) {
        if (this.prevContentRef) {
          this.prevContentRef.hide();
        }
        if (this.prevTabRef) {
          this.prevTabRef.inactive();
        }

        tab.contentRef.show();
        tab.tabRef.active();
        this.prevContentRef = tab.contentRef;
        this.prevTabRef = tab.tabRef;
      }

      return true
    });
  }

  renderContents() {
    const { tabs } = this.state;
    return tabs.map((tab, index) => tab.content);
  }

  renderIcons() {
    const { tabs } = this.state;
    return tabs.map((tab) => tab.icon);
  }

  componentDidMount() {
    let { initialTab } = this.props;
    //it means that we need to get the first tab name
    if (initialTab === "") {
      initialTab = this.state.tabs[0].name;
    }
    this.gotoTab(initialTab);
  }

  render() {
    const { BarComponent, barSize, barColor } = this.props;
    return (
      <View style={{ flex: 1 }}>
        {this.props.barGravity == 'top' ? this.renderIcons() : this.renderContents()}
        <BarComponent
          barColor={barColor}
          ref={REF_BAR}
          size={barSize}>
          {this.props.barGravity == 'top'? this.renderContents() : this.renderIcons()}
        </BarComponent>
      </View>
    );
  }
}

Tabbar.propTypes = {
  barSize: React.PropTypes.number,
  BarComponent: React.PropTypes.func,
  barColor: React.PropTypes.string,
  initialTab: React.PropTypes.string,
  barGravity: React.Proptypes.string
};

Tabbar.defaultProps = {
  barGravity: 'bottom',
  barSize: 50,
  BarComponent: Normalbar,
  barColor: 'gray',
  initialTab: ""
};

Tabbar.childContextTypes = {
  barSize: React.PropTypes.number,
  registerTabContent: React.PropTypes.func,
  registerTabIcon: React.PropTypes.func,
  gotoTab: React.PropTypes.func,
  getBarRef: React.PropTypes.func
};
