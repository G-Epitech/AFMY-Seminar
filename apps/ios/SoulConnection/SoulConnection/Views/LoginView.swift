//
//  LoginView.swift
//  SoulConnection
//
//  Created by Matheo Coquet on 10/09/2024.
//

import SwiftUI

struct LoginView: View {
    @State private var email: String = "jeanne.martin@soul-connection.fr"
    @State private var password: String = "naouLeA82oeirn"
    
    @Binding var token: String?
    
    init(token: Binding<String?>) {
        UINavigationBar.appearance().largeTitleTextAttributes = [.foregroundColor: UIColor.orange]
        
        self._token = token
    }
    
    var body: some View {
        NavigationView {
            VStack {
                Form {
                    Section() {
                        TextField("Email", text: $email)
                            .keyboardType(.emailAddress)
                            .textInputAutocapitalization(.never)
                        SecureField("Password", text: $password)
                    }
                    Section {
                        HStack {
                            Spacer()
                            Button("Login") {
                                Task {
                                    await redirectLogin()
                                }
                            }
                            .foregroundStyle(Color.white)
                            Spacer()
                        }.listRowBackground(Color.orange)
                    }
                }.navigationTitle("SoulConnection")
            }
        }
    }
    
    private func redirectLogin() async {
        do {
            let response = try await loginAPI(email: email, password: password)
            
            let defaults = UserDefaults.init()
            defaults.set(response.tokens.access, forKey: "accessToken")
            
            self.token = response.tokens.access
        } catch {
            print(error.localizedDescription)
        }
    }
}
