function Colors(props) {
  return (
    <Page>
      <Section
        title={<Text bold align="center">Color Settings</Text>}>
        <ColorSelect
          settingsKey="mainColor"
          colors={[
            {color: 'crimson'},
            {color: '#dd9060'},
            {color: 'gold'},
            {color: 'aquamarine'},
            {color: 'deepskyblue'},
            {color: 'plum'}
          ]}
        />
      </Section>
      <Section title={<Text bold align="center">UI elements</Text>}>
        <Select
          label={`Activity ring`}
          settingsKey="actRingContent"
          options={[
            {name:"Floor"},
            {name:"Active Minutes"},
            {name:"Calories"},
            {name:"Distance"},
          ]}
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(Colors);
