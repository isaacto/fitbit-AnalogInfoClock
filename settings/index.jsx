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
    </Page>
  );
}

registerSettingsPage(Colors);