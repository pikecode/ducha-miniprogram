// 完整的正确的render方法
render() {
  const {
    loginMode,
    userInfo,
    currentStep,
    inputPhoneNumber,
    isLogging,
    username,
    password,
    captchaCode,
    captchaImage
  } = this.state

  return (
    <View className='login'>
      <View className='login-header'>
        <View className='logo'>
          <Text className='logo-icon'>🦷</Text>
        </View>
        <Text className='app-name'>督查小程序</Text>
        <Text className='app-desc'>口腔质控专业平台</Text>
      </View>

      <View className='login-content'>
        {/* 登录模式切换按钮 */}
        {currentStep === 1 && (
          <View className='mode-switch'>
            <Button
              className='switch-btn'
              onClick={this.switchLoginMode}
            >
              {loginMode === 'oauth' ? '改用账号登录' : '改用微信登录'}
            </Button>
          </View>
        )}

        {/* 微信授权登录模式 */}
        {loginMode === 'oauth' && (
          <>
            {/* 步骤1：获取登录凭证 */}
            {currentStep === 1 && (
              <View className='auth-section'>
                <View className='auth-info'>
                  <Text className='auth-title'>微信登录</Text>
                  <Text className='auth-desc'>
                    获取登录凭证，开始登录流程
                  </Text>
                </View>
                <Button
                  className='auth-btn wechat-btn'
                  onClick={this.handleWechatLogin}
                >
                  <Text className='btn-icon'>🔑</Text>
                  获取登录凭证
                </Button>
              </View>
            )}

            {/* 步骤1.5：用户信息授权 */}
            {currentStep === 1.5 && (
              <View className='auth-section'>
                <View className='auth-info'>
                  <Text className='auth-title'>授权用户信息</Text>
                  <Text className='auth-desc'>
                    获取您的微信头像、昵称等基本信息，用于个性化服务
                  </Text>
                </View>
                <Button
                  className='auth-btn wechat-btn'
                  onClick={this.handleGetUserProfile}
                >
                  <Text className='btn-icon'>👤</Text>
                  授权用户信息
                </Button>
              </View>
            )}

            {/* 步骤2：输入手机号 */}
            {currentStep === 2 && (
              <View className='auth-section'>
                <View className='user-info'>
                  <Image
                    className='avatar'
                    src={userInfo.avatarUrl}
                    mode='aspectFill'
                  />
                  <Text className='nickname'>{userInfo.nickName}</Text>
                </View>

                <View className='auth-info'>
                  <Text className='auth-title'>输入手机号</Text>
                  <Text className='auth-desc'>
                    请输入您的手机号，用于账号验证和安全登录
                  </Text>
                </View>

                <View className='phone-input-section'>
                  <Input
                    className='phone-input'
                    type='number'
                    placeholder='请输入手机号'
                    maxlength={11}
                    value={inputPhoneNumber}
                    onInput={this.handlePhoneInput}
                  />
                  <Button
                    className='auth-btn confirm-btn'
                    onClick={this.handlePhoneConfirm}
                    disabled={!inputPhoneNumber}
                  >
                    下一步
                  </Button>
                </View>
              </View>
            )}

            {/* 步骤3：手机号验证 */}
            {currentStep === 3 && (
              <View className='auth-section'>
                <View className='user-info'>
                  <Image
                    className='avatar'
                    src={userInfo.avatarUrl}
                    mode='aspectFill'
                  />
                  <Text className='nickname'>{userInfo.nickName}</Text>
                  <Text className='phone-display'>手机号：{inputPhoneNumber}</Text>
                </View>

                <View className='auth-info'>
                  <Text className='auth-title'>手机号验证</Text>
                  <Text className='auth-desc'>
                    需要验证您的手机号以确保账号安全
                  </Text>
                </View>

                <Button
                  className='auth-btn phone-btn'
                  openType='getPhoneNumber'
                  onGetPhoneNumber={this.getPhoneNumber}
                  disabled={isLogging}
                >
                  <Text className='btn-icon'>📱</Text>
                  {isLogging ? '正在登录...' : '验证手机号'}
                </Button>
              </View>
            )}
          </>
        )}

        {/* 用户名密码登录模式 */}
        {loginMode === 'password' && currentStep === 1 && (
          <View className='password-login'>
            <View className='auth-info'>
              <Text className='auth-title'>账号登录</Text>
              <Text className='auth-desc'>
                使用用户名和密码登录系统
              </Text>
            </View>

            <View className='form-section'>
              <Input
                className='form-input'
                placeholder='请输入用户名'
                value={username}
                onInput={this.handleUsernameInput}
              />

              <Input
                className='form-input'
                type='password'
                placeholder='请输入密码'
                value={password}
                onInput={this.handlePasswordInput}
              />

              <View className='captcha-section'>
                <Input
                  className='captcha-input'
                  placeholder='请输入验证码'
                  value={captchaCode}
                  maxlength={4}
                  onInput={this.handleCaptchaInput}
                />
                <Image
                  className='captcha-image'
                  src={captchaImage}
                  mode='aspectFit'
                  onClick={this.loadCaptcha}
                />
              </View>

              <Button
                className='auth-btn login-btn'
                onClick={this.performPasswordLogin}
                disabled={isLogging || !username || !password || !captchaCode}
              >
                {isLogging ? '正在登录...' : '登录'}
              </Button>
            </View>
          </View>
        )}

        {/* 登录完成（通用） */}
        {currentStep === 4 && (
          <View className='success-section'>
            <View className='user-info'>
              <Image
                className='avatar'
                src={userInfo.avatarUrl}
                mode='aspectFill'
              />
              <Text className='nickname'>{userInfo.nickName}</Text>
              <Text className='phone-display'>手机号：{this.state.phoneNumber}</Text>
            </View>
            <View className='success-icon'>✅</View>
            <Text className='success-text'>登录成功，正在进入应用...</Text>
          </View>
        )}
      </View>

      <View className='login-footer'>
        <Text className='privacy-text'>
          登录即表示同意《用户协议》和《隐私政策》
        </Text>
      </View>
    </View>
  )
}