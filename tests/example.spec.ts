import { test, expect } from '@playwright/test';

test.describe('UI TP - Test Cases', () => {

  test.beforeEach(async ({ page }) => {

    await page.goto('http://uitestingplayground.com/');

  })

  test('TC1 : Click Button with Dynamic ID Succesfully', async ({ page }) => {

    await page.getByRole('link', { name: 'Dynamic ID' }).click();

    const dynamicPageHeader = page.getByRole('heading', { name: 'Dynamic ID' });
    await expect(dynamicPageHeader).toBeVisible();
    await expect(page).toHaveURL(/.*dynamicid/);

    const dynamicButton = page.getByRole('button', { name: 'Button with Dynamic ID' });
    await expect(dynamicButton).toBeEnabled();
    await dynamicButton.click();

  })

  test('TC2 : Class Attribute Challenge', async ({ page }) => {

    await page.getByRole('link', { name: 'Class Attribute' }).click();

    page.once('dialog', async dialog => {
      console.log(`Alert mesaji: ${dialog.message()}`);
      await dialog.accept();
    });

    await page.locator('button.btn-primary').click();
  })

  test('TC 3: Green Button Can Not be Hit Twice due to Hidden Layer Overlay', async ({ page }) => {

    await page.getByRole('link', { name: 'Hidden Layers' }).click();

    const greenButton = page.locator('#greenButton');

    //1.Tıklama
    await greenButton.click();

    //2.Tıklama : Yeşil butonun üstü mavi buton ile kapandığı için Playwright'ın tıklayamayıp HATA vermesini bekliyoruz.
    //Timeout süresini kısa tutuyoruz ki test 30 saniye boyunca boşuna beklemesin (ör: 2 saniye)

    await expect(greenButton.click({ timeout: 2000 })).rejects.toThrow();
  })

  test('TC 4 : Should Wait for Page Load Delay Automatically and Click Button', async ({ page }) => {

    await page.getByRole('link', { name: 'Load Delay' }).click();

    const loadPageHeader = page.getByRole('heading', { name: 'Load Delays' });
    await expect(loadPageHeader).toBeVisible();
    await expect(page).toHaveURL(/.*loaddelay/)

    const delayButton = page.getByRole('button', { name: 'Button Appearing After Delay' });
    await expect(delayButton).toBeVisible();
    await delayButton.click();


  })

  test('TC 5 : Should Wait for AJAX Request to Complete and Display Loaded Date', async ({ page }) => {

    await page.getByRole('link', { name: 'AJAX Data' }).click();

    const ajaxPageHeader = page.getByRole('heading', { name: 'AJAX Data' });
    await expect(ajaxPageHeader).toBeVisible();
    await expect(page).toHaveURL(/.*ajax/);

    const ajaxButton = page.getByRole('button', { name: 'Button Triggering AJAX Request' });
    await expect(ajaxButton).toBeVisible();
    await ajaxButton.click();

    const successMessage = page.getByText(/Data loaded with AJAX get request/i);
    await expect(successMessage).toBeVisible({ timeout: 20000 });
  })

  test('TC 6 : Should Wait for Client-Side JavaScript Delay to Render Success Element', async ({ page }) => {

    await page.getByRole('link', { name: 'Client Side Delay' }).click();

    const clientHeader = page.getByRole('heading', { name: 'Client Side Delay' });
    await expect(clientHeader).toBeVisible();
    await expect(page).toHaveURL(/.*clientdelay/);

    const clientButton = page.getByRole('button', { name: 'Button Triggering Client Side Logic' });
    await expect(clientButton).toBeVisible();
    await clientButton.click();

    const successMessage = page.getByText(/Data calculated on the client side/i);
    await expect(successMessage).toBeVisible({ timeout: 20000 });
  })

  test('TC 7 : Should Successfully Execute Click Event on Custom Button Element', async ({ page }) => {

    await page.getByRole('link', { name: 'Click' }).first().click();

    const clickHeader = page.getByRole('heading', { name: 'Click' });
    await expect(clickHeader).toBeVisible();
    await expect(page).toHaveURL(/.*click/);

    const clickButton = page.getByRole('button', { name: /Button That Ignores DOM Click Event/i });
    await expect(clickButton).toBeVisible();
    await clickButton.click();

    await expect(clickButton).toHaveClass(/btn-success/);

  })

  test('TC 8 : Should Update Button Text Based On Input Value', async ({ page }) => {

    await page.getByRole('link', { name: 'Text Input' }).click();

    const inputHeader = page.getByRole('heading', { name: 'Text Input' });
    await expect(inputHeader).toBeVisible();
    await expect(page).toHaveURL(/.*textinput/);

    const inputField = page.getByPlaceholder(/MyButton/i);
    const inputFieldText = 'Tiklanacak Buton';
    await inputField.fill(inputFieldText);

    const buttonText = page.locator('#updatingButton');
    await buttonText.click();
    await expect(buttonText).toHaveText(inputFieldText);

  })

  test('TC 9 : Should Automatically Scroll to Hidden Button and Click It', async ({ page }) => {

    await page.getByRole('link', { name: 'Scrollbars' }).click();

    const scrollHeader = page.getByRole('heading', { name: 'Scrollbars' });
    await expect(scrollHeader).toBeVisible();
    await expect(page).toHaveURL(/.*scrollbars/);

    const hidingButton = page.getByRole('button', { name: /hiding button/i });
    await hidingButton.click();
    await expect(hidingButton).toBeVisible();

  })

  test('TC 10 : Should Dynamically Compare Chrome CPU Value Between Table and Label', async ({ page }) => {

    await page.getByRole('link', { name: 'Dynamic Table' }).click();

    const dynamicHeader = page.getByRole('heading', { name: 'Dynamic Table' });
    await expect(dynamicHeader).toBeVisible();
    await expect(page).toHaveURL(/.*dynamictable/);

    //Chrome satırındaki CPU değerinin bulunduğu hücre içerisindeki değeri çektik.
    const chromeRow = page.getByRole('row', { name: /chrome/i });
    const cpuCell = chromeRow.getByText(/%/);
    const cpuValueFromTable = await cpuCell.innerText();

    //Tablo altındaki sarı bölümdeki metni aldık.
    const chromeLabel = page.locator('.bg-warning');
    await expect(chromeLabel).toBeVisible();
    const labelText = await chromeLabel.innerText();

    //Sarı bölümden çektiğimiz metin , tablodan çektiğimiz CPU değerini içeriyor mu ?
    expect(labelText).toContain(cpuValueFromTable);
  })

  test('TC 11 : Should Locate and Verify Text Inside Complex DOM Scructure', async ({ page }) => {

    await page.getByRole('link', { name: 'Verify Text' }).click();

    const verifyHeader = page.getByRole('heading', { name: 'Verify Text' });
    await expect(verifyHeader).toBeVisible();
    await expect(page).toHaveURL(/.*verifytext/);

    const welcomeText = page.getByText('Welcome UserName!', { exact: true });
    await expect(welcomeText).toBeVisible();
  })

  test('TC 12 : Should Stop Progress Bar at %75', async ({ page }) => {

    await page.getByRole('link', { name: 'Progress Bar' }).click();

    const progressHeader = page.getByRole('heading', { name: 'Progress Bar' });
    await expect(progressHeader).toBeVisible();
    await expect(page).toHaveURL(/.*progressbar/);

    //Butonlar ve Bar Tanımlanır
    const startButton = page.getByRole('button', { name: 'Start' });
    const stopButton = page.getByRole('button', { name: 'Stop' });
    const progressBar = page.getByRole('progressbar');

    //Yükleme Başlat
    await startButton.click();

    //Progress Bar'ın aria-valuenow değerinin 75 olmasını dinamik olarak bekle
    //Playwright locator bildirimleri sayesinde aria attribute değişimini izleyebiliriz
    //attached kullanmamızın sebebi aria-valuenow="75" niteliğinin DOM yapısına bağlanmasını (attached) bekledik.Bu bize min. gecikmeyi sağladı.
    const targetProgressBar = page.locator('[aria-valuenow="75"]');
    await targetProgressBar.waitFor({ state: 'attached', timeout: 30000 });

    //Değer 75 olduğunda Stop Bas
    await stopButton.click();

    //Durdurulan Değerin 75 civarında olduğunu teyit et.
    const finalValue = await progressBar.getAttribute('aria-valuenow');
    console.log(`Durdurulan Progress Bar Değeri: %${finalValue}`);

    //Değerin 75 veya çok yakın bir değer (örn. 75-77) olduğunu kontrol et
    expect(Number(finalValue)).toBeGreaterThanOrEqual(75);
  })

  test('TC 13 : Should Handle Element Visibility and Hidden States', async ({ page }) => {

    await page.getByRole('link', { name: 'Visibility' }).click();

    const visibilityHeader = page.getByRole('heading', { name: 'Visibility' });
    await expect(visibilityHeader).toBeVisible();
    await expect(page).toHaveURL(/.*visibility/);

    const hideButton = page.getByRole('button', { name: 'Hide' });
    const removedButton = page.getByRole('button', { name: 'Removed' });
    const zeroWidthButton = page.getByRole('button', { name: 'Zero Width' });
    const overlappedButton = page.getByRole('button', { name: 'Overlapped' });
    const opacityZeroButton = page.getByRole('button', { name: 'Opacity 0' });
    const hiddenButton = page.getByRole('button', { name: 'Visibility Hidden' });
    const displayNoneButton = page.getByRole('button', { name: 'Display None' });
    const offscreenButton = page.getByRole('button', { name: 'Offscreen' });

    await expect(removedButton).toBeVisible();
    await expect(zeroWidthButton).toBeVisible();
    await expect(overlappedButton).toBeVisible();
    await expect(opacityZeroButton).toBeVisible();
    await expect(hiddenButton).toBeVisible();
    await expect(displayNoneButton).toBeVisible();
    await expect(offscreenButton).toBeVisible();

    await hideButton.click();

    // Playwright'ın toBeHidden() assertion'ı display:none, visibility:hidden,
    // opacity:0, 0x0 boyut veya DOM'dan silinme durumlarının tümünü otomatik kapsar!
    await expect(removedButton).toBeHidden();
    await expect(zeroWidthButton).toBeHidden();
    //CSS'teki opacity: 0 durumu, elemanı şeffaf yapar ama eleman hala DOM'dadır ve ekranda yer kaplar. 
    //Playwright felsefesine göre opacity: 0 olan bir eleman teknik olarak UI üzerinde yer kapladığı için visible sayılır.
    await expect(opacityZeroButton).toHaveCSS('opacity', '0');
    await expect(hiddenButton).toBeHidden();
    await expect(displayNoneButton).toBeHidden();
    await expect(offscreenButton).toHaveClass(/offscreen/);
  })

  test('TC 14 : Should Handle Login with Dynamic Status', async ({ page }) => {

    await page.getByRole('link', { name: 'Sample App' }).click();

    const sampleAppHeader = page.getByRole('heading', { name: 'Sample App' });
    await expect(sampleAppHeader).toBeVisible();
    await expect(page).toHaveURL(/.*sampleapp/);

    const userNameInput = page.getByPlaceholder('User Name');
    const passwordInput = page.getByPlaceholder('********');
    const loginButton = page.getByRole('button', { name: /log in/i });
    const loginStatus = page.locator('#loginstatus');
    const logOutButton = page.getByRole('button', { name: 'Log Out' });

    //Başarılı Login/Logout Senaryosu
    const userName = 'Test11'
    await userNameInput.fill(userName);
    await passwordInput.fill('pwd');
    await loginButton.click();
    await expect(loginStatus).toHaveText(`Welcome, ${userName}!`);
    await logOutButton.click();
    await expect(loginStatus).toHaveText('User logged out.');

    //Başarısız Login Senaryosu
    await userNameInput.fill('Test11');
    await passwordInput.fill('Deneme11');
    await loginButton.click();
    await expect(loginStatus).toHaveText('Invalid username/password');


  })

  test('TC 15 : Should Handle Mouse Over and Dynamic Element Updates', async ({ page }) => {

    await page.getByRole('link', { name: 'Mouse Over' }).click();

    const mouseOverHeader = page.getByRole('heading', { name: 'Mouse Over' });
    await expect(mouseOverHeader).toBeVisible();
    await expect(page).toHaveURL(/.*mouseover/);

    //Hover Edilecek Elemanı Bul ve Fareyi Üzerine Getir
    const hoverTarget = page.getByText('Click me');
    await hoverTarget.hover();

    // 3. Hover sonrası tetiklenen veya beliren elemana tıkla
    // (Duruma göre hover sonrası DOM'da değişen yeni link/button yapısını yakalarız)
    const activeTarget = page.getByTitle('Active Link');
    await activeTarget.click();

    //Sayaç ve Durum Metnini Doğrula
    const clickCount = page.locator('#clickCount');
    await expect(clickCount).toHaveText('1');
  })

  test('TC 16 : Should Handle Non-Breaking Space Element', async ({ page }) => {

    await page.getByRole('link', { name: 'Non-Breaking Space' }).click();

    const nonBreakingHeader = page.getByRole('heading', { name: 'Non-Breaking Space' });
    await expect(nonBreakingHeader).toBeVisible();
    await expect(page).toHaveURL(/.*nbsp/);

    const myButton = page.getByRole('button', { name: 'My Button' });
    await myButton.click();
    await expect(myButton).toBeVisible();
  })

  test('TC 17 : Should Handle Overlapped Element with Scroll', async ({ page }) => {

    await page.getByRole('link', { name: 'Overlapped Element' }).click();

    const overlappedHeader = page.getByRole('heading', { name: 'Overlapped Element' });
    await expect(overlappedHeader).toBeVisible();
    await expect(page).toHaveURL(/.*overlapped/);

    const idInput = page.getByPlaceholder('Id');
    const nameInput = page.getByPlaceholder('Name');

    await idInput.fill('12345');

    // Overlapped (üzeri çakışmış/kapanmış) Name alanına odaklanmak için scroll yap
    // Playwright çoğu zaman otoscroll yapar ancak div-level scroll olan durumlarda 
    // 'scrollIntoViewIfNeeded()' veya ilgili div'in scroll'unu tetiklemek gerekir.

    await nameInput.evaluate((element) => element.scrollIntoView({ block: 'center' }));
    await nameInput.fill('Tester');

    await expect(nameInput).toHaveValue('Tester');
  })

  test('TC 18 : Should Handle Shadow DOM Elements', async ({ page }) => {

    await page.getByRole('link', { name: 'Shadow DOM' }).click();

    const shadowDOMHeader = page.getByRole('heading', { name: 'Shadow DOM' });
    await expect(shadowDOMHeader).toBeVisible();
    await expect(page).toHaveURL(/.*shadowdom/);

    // Playwright Shadow Root yapısını otomatik aşar.
    const generateButton = page.locator('#buttonGenerate');
    const copyButton = page.locator('#buttonCopy');
    const editField = page.locator('#editField');

    await generateButton.click();
    await expect(editField).not.toHaveValue('');
    await copyButton.click();
  })

  test('TC 19 : Should Handle Classic Alerts', async ({ page }) => {

    await page.getByRole('link', { name: 'Alerts' }).click();

    const alertHeader = page.getByRole('heading', { name: 'Alerts' });
    await expect(alertHeader).toBeVisible();
    await expect(page).toHaveURL(/.*alerts/);

    // 1. Alert (Sadece OK / Tamam butonu olan klasik uyarı)
    page.once('dialog', async (dialog) => {
      expect(dialog.type()).toBe('alert');
      expect(dialog.message()).toBeTruthy();
      await dialog.accept(); // Tamam'a bas
    });
    await page.getByRole('button', { name: 'Alert' }).click();

    // 2. Confirm (Tamam / İptal seçenekli doğrulama diyalogu)
    page.once('dialog', async (dialog) => {
      expect(dialog.type()).toBe('confirm');
      await dialog.accept(); // Veya iptal etmek için dialog.dismiss();
    });
    await page.getByRole('button', { name: 'Confirm' }).click();

    // 3. Prompt (Metin girdisi kabul eden diyalog)
    page.once('dialog', async (dialog) => {
      expect(dialog.type()).toBe('prompt');
      await dialog.accept('Playwright Test User'); // Prompt içine metin gönderip kabul et
    });
    await page.getByRole('button', { name: 'Prompt' }).click();
  })

  test('TC 20 : Should Handle File Upload', async ({ page }) => {

    await page.getByRole('link', { name: 'File Upload' }).click();

    const fileUploadHeader = page.getByRole('heading', { name: 'File Upload' });
    await expect(fileUploadHeader).toBeVisible();
    await expect(page).toHaveURL(/.*upload/);

    // 2. Iframe içerisindeki file input'u hedefliyoruz
    // UI Testing Playground'daki upload alanı iframe içerisindedir:
    const uploadFrame = page.frameLocator('iframe');
    const fileInput = uploadFrame.locator('input[type="file"]');

    // 3. Dosyayı yükle (Klasör adının Explorer'daki ile birebir aynı olmasına dikkat: 'Fixtures')
    await fileInput.setInputFiles('tests/Fixtures/sample.txt');

    // 4. Yüklemenin başarılı olduğunu iframe içindeki metinle doğrula
    await expect(uploadFrame.getByText('sample.txt')).toBeVisible();
  })

  test('TC 21 : Should Handle Animated Button', async ({ page }) => {

    await page.getByRole('link', { name: 'Animated Button' }).click();

    const animatedHeader = page.getByRole('heading', { name: 'Animated Button' });
    await expect(animatedHeader).toBeVisible();
    await expect(page).toHaveURL(/.*animation/);

    const startButton = page.getByRole('button', { name: 'Start Animation' });
    await startButton.click();

    const animatedButton = page.getByRole('button', { name: /Moving Target/i })
    await expect(animatedButton).not.toHaveClass(/spin|moving|animated/, { timeout: 10000 });
    await animatedButton.click();

    await expect(page.locator('#opstatus')).toContainText('Moving Target clicked');
  })

  test('TC 22 : Should Handle Disabled Input', async ({ page }) => {

    await page.getByRole('link', { name: 'Disabled Input' }).click();

    const disabledInputHeader = page.getByRole('heading', { name: 'Disabled Input' });
    await expect(disabledInputHeader).toBeVisible();
    await expect(page).toHaveURL(/.*disabledinput/);

    const enableEditBtn = page.getByRole('button', { name: /Enable Edit Field with 5 seconds delay/i });
    const inputField = page.getByPlaceholder('Change me...');
    const inputFieldText = 'Disabled Input Case Success';

    await enableEditBtn.click();

    await expect(page.locator('#opstatus')).toContainText('Input Enabled...', { timeout: 10000 });
    await inputField.fill(inputFieldText);
    await expect(inputField).toHaveValue(inputFieldText);
  })

  test('TC 23 : Auto Wait - Verify All Element Types with 5s Delay', async ({ page }) => {

    await page.getByRole('link', { name: 'Auto Wait' }).click();

    const autoWaitHeader = page.getByRole('heading', { name: 'Auto Wait' });
    await expect(autoWaitHeader).toBeVisible();
    await expect(page).toHaveURL(/.*autowait/);

    const settingsSelect = page.getByRole('combobox', { name: /Choose an element type:/i });
    const playground = page.locator('#element-container');
    const elementTypes = ['Button', 'Input', 'Textarea', 'Select', 'Label'];

    for (const elementType of elementTypes) {
      await settingsSelect.selectOption(elementType);
      await page.getByRole('button', { name: 'Apply 5s' }).click();

      switch (elementType) {
        case 'Button':
          await expect(playground.getByRole('button', { name: 'Button' })).toBeVisible({ timeout: 10000 });
          break;

        case 'Input':
          await expect(playground.getByRole('textbox')).toBeVisible({ timeout: 10000 });
          break;

        case 'Textarea':
          await expect(playground.getByRole('textbox')).toBeVisible({ timeout: 10000 });
          break;

        case 'Select':
          const selectElement = playground.getByRole('combobox');
          await expect(selectElement).toBeVisible({ timeout: 10000 });
          const playgroundItemTypes = ['Item 1', 'Item 2', 'Item 3'];

          for (const item of playgroundItemTypes) {
            await selectElement.selectOption(item);
            await expect(selectElement).toHaveValue(item);
          }
          break;

        case 'Label':
          await expect(playground).toHaveText('This is a Label', { timeout: 10000 });
          break;
      }
    }
  })

  test('TC 24 : Nested Frames ', async ({ page }) => {

    await page.getByRole('link', { name: 'Frames' }).click();

    const framesHeader = page.getByRole('heading', { name: 'Frames' });
    await expect(framesHeader).toBeVisible();
    await expect(page).toHaveURL(/.*frames/);

    const outerFrame = page.frameLocator('iframe').first();
    const innerFrame = outerFrame.frameLocator('iframe');
    const outerResult = outerFrame.locator('#result');
    const innerResult = innerFrame.locator('#result');

    //Outer Frame İçerisindeki Tıklamalar

    await outerFrame.getByRole('button', { name: 'Edit' }).click();
    await expect(outerResult).toHaveText('Button pressed: Edit');

    await outerFrame.getByRole('button', { name: 'Submit' }).click();
    await expect(outerResult).toHaveText('Button pressed: Submit');

    await outerFrame.getByRole('button', { name: /click me/i }).click();
    await expect(outerResult).toHaveText('Button pressed: Click me');

    await outerFrame.getByRole('button', { name: 'Primary' }).click();
    await expect(outerResult).toHaveText('Button pressed: Primary');

    //Inner Frame İçerisindeki Tıklamalar

    await innerFrame.getByRole('button', { name: 'Edit' }).click();
    await expect(innerResult).toHaveText('Button pressed: Edit');

    await innerFrame.getByRole('button', { name: 'Submit' }).click();
    await expect(innerResult).toHaveText('Button pressed: Submit');

    await innerFrame.getByRole('button', { name: /click me/i }).click();
    await expect(innerResult).toHaveText('Button pressed: Click me');

    await innerFrame.getByRole('button', { name: 'Primary' }).click();
    await expect(innerResult).toHaveText('Button pressed: Primary');
  })

  test('TC 26 : Clear Input - Clean All Fields and Verify Counter', async ({ page }) => {

    await page.getByRole('link', { name: 'Clear Input' }).click();
    await expect(page.getByRole('heading', { name: 'Clear Input' })).toBeVisible();
    await expect(page).toHaveURL(/.*clearinput/);

    //Başlangıçta 9 dolu alan olduğunu doğrulayalım
    const remainingCounter = page.locator('text=/Non-empty fields remaining:/i')
    await expect(remainingCounter).toContainText('9');
    const resultText = page.locator('#opstatus');

    //Standart Input Ve Textarea Alanlarını Temizleme
    const inputFields = page.locator('input , textarea');
    const count = await inputFields.count();

    for (let i = 0; i < count; i++) {
      const field = inputFields.nth(i);
      await field.clear();
      await expect(field).toHaveValue('');
    }

    const editableDiv = page.locator('[contenteditable="true"]');
    await editableDiv.click();

    // Tüm metni seç ve sil (En kararlı yöntem)
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');

    await expect(editableDiv).toHaveText('');

    await expect(resultText).toHaveText('All fields are cleared!');
  })

  test('TC 27 : Scroll to Click All Cases', async ({ page }) => {

    await page.getByRole('link', { name: 'Scroll to Click' }).click();
    await expect(page.getByRole('heading', { name: 'Scroll to Click' })).toBeVisible();
    await expect(page).toHaveURL(/.*scrolltoclick/);

    const counter = page.getByText(/Buttons Clicked:/i);
    await counter.scrollIntoViewIfNeeded();
    await expect(counter).toContainText('0 / 4');

    //Case 1 - Page Scroll
    const btn1 = page.locator('#scrollTarget1');
    await btn1.scrollIntoViewIfNeeded();
    await btn1.click();
    await expect(btn1).toHaveText('Clicked!');

    //Case 2 - Container Scroll
    const btn2 = page.locator('#scrollTarget2');
    await btn2.click();
    await expect(btn2).toHaveText('Clicked!');

    //Case 3 - Nested Scroll
    const btn3 = page.locator('#scrollTarget3');
    await btn3.click();
    await expect(btn3).toHaveText('Clicked!');

    //Case 4 - Hover to Reveal
    const targetRow = page.getByText('Weekly status report');
    await targetRow.hover();

    const flagButton = page.locator('#scrollTarget4');
    await flagButton.click();
    await expect(flagButton).toHaveText('Clicked!');

    //Final Assertion
    const progressText = page.locator('#progressText')
    await expect(progressText).toHaveText('All buttons clicked!');
  })

  test('TC 28 : CSS Selectors & Nested Shadow DOM', async ({ page }) => {

    await page.getByRole('link', { name: 'CSS Selectors' }).click();
    await expect(page.getByRole('heading', { name: 'CSS Selectors' })).toBeVisible();
    await expect(page).toHaveURL(/.*cssselectors/);

    //Case 1 - Basic CSS Selectors
    const primaryBtn = page.locator('#primary-btn');
    const firstClassBtn = page.locator('.btn').first();
    const userNameInput = page.locator('input[placeholder="Username"]');
    const emailInput = page.locator('input[placeholder="Email"]');

    //Case 2 - nth-child Selectors
    const cell3_2 = page.locator('table tr:nth-child(3) td:nth-child(2)');
    await expect(cell3_2).toHaveText('Row 3, Cell 2');

    //Case 3 - Visibility Tests
    const visibleBtn = page.locator('button:visible:has-text("I am visible")');
    await expect(visibleBtn).toBeVisible();

    //Case 4 - Nested Shadow DOM

    //Playwright iç içe 3 seviye Shadow DOM olsa bile CSS/Role ile direkt hedefe ulaşır!

    //Level 1
    const level1Input = page.getByPlaceholder('Level 1 Input');
    await level1Input.fill('Level 1 Test');

    //Level 2
    const level2Btn = page.getByRole('button', { name: 'Level 2 Button' });
    await level2Btn.click();
    const level2Input = page.getByPlaceholder('Level 2 Input');
    await level2Input.fill('Level 2 Test')

    //Level 3
    const level3Btn = page.getByRole('button', { name: 'Level 3 Button' });
    await level3Btn.click();
    const level3Input = page.getByPlaceholder('Level 3 Input');
    await level3Input.fill('Level 3 Test');
  })

  test('TC 29 : Select Dropdown Controls', async ({ page }) => {

    await page.getByRole('link', { name: 'Select', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Select' })).toBeVisible();
    await expect(page).toHaveURL(/.*select/);

    //Case 1 - Single Select
    const langSelect = page.locator('#selectLanguage');
    await langSelect.selectOption({ label: 'JavaScript' });
    const statusText = page.locator('#statusLanguage');
    await expect(statusText).toHaveText('Selected: JavaScript (value: js)');

    //Case 2 - Non-Breaking Spaces
    const citySelect = page.locator('#selectCity');
    await citySelect.selectOption({ label: 'Los Angeles' });
    const cityStatusText = page.locator('#statusCity');
    await expect(cityStatusText).toContainText('Selected: Los Angeles (value: la)');

    //Case 3 - Select by Value
    const versionSelect = page.locator('#selectProduct');
    await versionSelect.selectOption({value:'v2.0'});       //veya 'v2.0'
    await expect(page.getByText(/Selected: 2.0|v2.0/i)).toBeVisible();

    //Case 4 - Multi Select
    const colorSelect = page.locator('#selectColors');
    await colorSelect.selectOption(['Red', 'Blue']);
    await expect(page.getByText(/Selected: Red, Blue|Blue, Red/i)).toBeVisible();

    //Case 5 - Multi Select with Pre-Selected Items
    const fruitSelect = page.locator('#selectFruits');
    await fruitSelect.selectOption(['Banana', 'Fig']);
    await expect(page.getByText(/Selected: Banana, Fig/i)).toBeVisible();
  })

})